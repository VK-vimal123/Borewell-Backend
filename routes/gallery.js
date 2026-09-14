const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Gallery = require('../models/Gallery');
const { galleryData } = require('../seeds/seedData');

// Ensure upload and data directories exist
const uploadDir = path.join(__dirname, '../../frontend/assets/images/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const storeFilePath = path.join(dataDir, 'gallery_store.json');

// Persistent storage helper functions
function loadGalleryStore() {
  try {
    if (fs.existsSync(storeFilePath)) {
      const data = fs.readFileSync(storeFilePath, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading gallery_store.json:', err.message);
  }

  // Initialize from seedData if not existing or invalid
  const initial = galleryData.map((item, idx) => ({
    ...item,
    _id: 'seed_' + (idx + 1),
    isActive: true,
    createdAt: item.createdAt || new Date(Date.now() - idx * 3600000).toISOString()
  }));

  saveGalleryStore(initial);
  return initial;
}

function saveGalleryStore(items) {
  try {
    fs.writeFileSync(storeFilePath, JSON.stringify(items, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving gallery_store.json:', err.message);
  }
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'work-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter: function (req, file, cb) {
    const allowed = /jpeg|jpg|png|webp|svg|gif/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname || mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files (JPG, PNG, WEBP, SVG) are allowed!'));
  }
});

// Valid Owner PINs for Nathan
const VALID_PINS = ['9344', 'admin123', '9344604042'];

// POST /api/gallery/verify-pin - Owner PIN authentication
router.post('/verify-pin', (req, res) => {
  const { pin } = req.body;
  if (!pin) {
    return res.status(400).json({ success: false, message: 'Owner PIN is required' });
  }

  const cleanPin = String(pin).trim();
  if (VALID_PINS.includes(cleanPin)) {
    return res.json({
      success: true,
      message: 'Owner authenticated successfully',
      ownerName: 'Nathan',
      token: 'owner_session_' + Date.now()
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid Owner PIN. Please enter your registered workshop PIN.'
  });
});

// Helper for category matching
function matchesCategory(itemCat, targetCat) {
  if (!targetCat || targetCat === 'all') return true;
  if (!itemCat) return false;
  const ic = itemCat.toLowerCase();
  const tc = targetCat.toLowerCase();
  if (ic === tc) return true;
  if (tc === 'workshop' && (ic.includes('lathe') || ic.includes('workshop') || ic.includes('turning'))) return true;
  if (tc === 'welding' && (ic.includes('weld') || ic.includes('fabricat') || ic.includes('structure'))) return true;
  if (tc === 'rig' && (ic.includes('rig') || ic.includes('borewell') || ic.includes('overhaul'))) return true;
  if (tc === 'drilling_rods' && (ic.includes('rod') || ic.includes('thread') || ic.includes('drill'))) return true;
  if (tc === 'compressor' && ic.includes('compressor')) return true;
  return ic.includes(tc);
}

// GET /api/gallery - Retrieve all gallery items or filtered by category
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    if (mongoose.connection.readyState === 1) {
      let filter = { isActive: true };
      if (category && category !== 'all') {
        const c = category.toLowerCase();
        if (c === 'workshop') filter.category = { $regex: /workshop|lathe|turning/i };
        else if (c === 'welding') filter.category = { $regex: /weld|fabricat|structure/i };
        else if (c === 'rig') filter.category = { $regex: /rig|borewell|overhaul/i };
        else if (c === 'drilling_rods') filter.category = { $regex: /rod|thread|drill/i };
        else if (c === 'compressor') filter.category = { $regex: /compressor/i };
        else filter.category = { $regex: new RegExp(category, 'i') };
      }
      const dbItems = await Gallery.find(filter).sort({ createdAt: -1 });
      if (dbItems && dbItems.length > 0) {
        return res.json({ success: true, count: dbItems.length, data: dbItems });
      }
    }

    // Load from persistent file store
    let store = loadGalleryStore();
    if (category && category !== 'all') {
      store = store.filter(item => matchesCategory(item.category, category));
    }
    return res.json({ success: true, count: store.length, data: store });
  } catch (error) {
    console.error('Error in gallery route:', error.message);
    let store = loadGalleryStore();
    if (req.query.category && req.query.category !== 'all') {
      store = store.filter(item => matchesCategory(item.category, req.query.category));
    }
    return res.json({ success: true, count: store.length, data: store });
  }
});

// POST /api/gallery/upload - Upload new work photo with metadata
router.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const { title, category, description } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: 'Work Title and Category / Work Type are required'
      });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = `assets/images/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please select an image file to upload'
      });
    }

    const formattedTitle = typeof title === 'string'
      ? { en: title.trim(), ta: title.trim(), hi: title.trim() }
      : title;

    const descText = (description || '').trim();
    const formattedDesc = typeof description === 'string'
      ? { en: descText, ta: descText, hi: descText }
      : (description || { en: descText, ta: descText, hi: descText });

    const newId = 'work_' + Date.now() + '_' + Math.round(Math.random() * 1e4);
    const itemObj = {
      _id: newId,
      title: formattedTitle,
      category: category.trim(),
      imageUrl: imageUrl,
      description: formattedDesc,
      displayOrder: 0,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    // 1. Immediately save to persistent JSON disk storage
    const store = loadGalleryStore();
    store.unshift(itemObj);
    saveGalleryStore(store);

    // 2. If MongoDB is connected, also save to database
    if (mongoose.connection.readyState === 1) {
      try {
        await Gallery.create(itemObj);
      } catch (dbErr) {
        console.warn('MongoDB sync note for uploaded photo:', dbErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Work photo uploaded and permanently published to gallery!',
      data: itemObj
    });
  } catch (error) {
    console.error('Error uploading gallery photo:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload photo: ' + error.message
    });
  }
});

// PUT /api/gallery/:id - Edit gallery work photo metadata
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description } = req.body;

    const updateFields = {};
    if (title) {
      updateFields.title = typeof title === 'string'
        ? { en: title.trim(), ta: title.trim(), hi: title.trim() }
        : title;
    }
    if (category) {
      updateFields.category = category.trim();
    }
    if (description !== undefined) {
      const descText = typeof description === 'string' ? description.trim() : '';
      updateFields.description = typeof description === 'string'
        ? { en: descText, ta: descText, hi: descText }
        : description;
    }

    // 1. Update persistent JSON disk store
    const store = loadGalleryStore();
    const index = store.findIndex(item => String(item._id) === String(id) || String(item.id) === String(id));
    let updatedItem = null;

    if (index !== -1) {
      store[index] = { ...store[index], ...updateFields };
      updatedItem = store[index];
      saveGalleryStore(store);
    }

    // 2. Update MongoDB if connected
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      try {
        await Gallery.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
      } catch (dbErr) {
        // ignore non-fatal
      }
    }

    if (updatedItem) {
      return res.json({ success: true, message: 'Gallery item updated successfully', data: updatedItem });
    }

    return res.status(404).json({ success: false, message: 'Gallery item not found' });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return res.status(500).json({ success: false, message: 'Failed to update gallery item', error: error.message });
  }
});

// DELETE /api/gallery/:id - Delete gallery work photo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Remove from persistent JSON disk store
    const store = loadGalleryStore();
    const index = store.findIndex(item => String(item._id) === String(id) || String(item.id) === String(id));
    let deletedItem = null;

    if (index !== -1) {
      deletedItem = store[index];
      if (deletedItem.imageUrl && deletedItem.imageUrl.startsWith('assets/images/uploads/')) {
        const filePath = path.join(__dirname, '../../frontend', deletedItem.imageUrl);
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
        }
      }
      store.splice(index, 1);
      saveGalleryStore(store);
    }

    // 2. Remove from MongoDB if connected
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      try {
        await Gallery.findByIdAndDelete(id);
      } catch (dbErr) {
        // ignore
      }
    }

    return res.json({ success: true, message: 'Work photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete gallery item', error: error.message });
  }
});

module.exports = router;
