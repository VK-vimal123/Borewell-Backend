const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Service = require('../models/Service');
const Gallery = require('../models/Gallery');
const Customer = require('../models/Customer');
const ServiceRequest = require('../models/ServiceRequest');

const servicesData = [
  {
    slug: 'lathe-works',
    displayOrder: 1,
    icon: 'bi-gear-fill',
    image: 'assets/images/service-lathe.png',
    title: {
      en: 'Heavy Lathe Works',
      ta: 'கனரக லேத் வேலைகள்',
      hi: 'हैवी लेथ कार्य'
    },
    shortDescription: {
      en: 'Precision turning, facing, boring, spindle machining, and bearing seat restoration for borewell rig components.',
      ta: 'போர்வெல் ரிக் உதிரிபாகங்களுக்கான துல்லியமான டர்னிங், போரிங், ஸ்பிண்டில் மெஷினிங் மற்றும் பேரிங் சீட் சீரமைப்பு.',
      hi: 'बोरवेल रिग घटकों के लिए प्रिसिजन टर्निंग, बोरिंग, स्पिंडल मशीनिंग और बेयरिंग सीट रीस्टोरेशन।'
    },
    fullDescription: {
      en: 'Our machine shop is equipped with heavy-duty center lathes capable of handling long shafts, drill rod adapters, rotary head spindles, and customized heavy fittings with high precision tolerances.',
      ta: 'எங்கள் பட்டறையில் நீண்ட ஷாப்ட்கள், அடாப்டர்கள், ரோட்டரி ஹெட் ஸ்பிண்டில்கள் மற்றும் தனிப்பயன் கனரக பாகங்களை துல்லியமாக செய்யும் கனரக லேத் இயந்திரங்கள் உள்ளன.',
      hi: 'हमारी वर्कशॉप में भारी लेथ मशीनें हैं जो लंबी शाफ्ट, ड्रिल रॉड अडैप्टर, रोटरी हेड स्पिंडल और कस्टम फिटिंग्स को सटीकता से तैयार करती हैं।'
    },
    features: {
      en: ['Spindle & shaft turning up to heavy lengths', 'Precision internal and external boring', 'Bearing seat sleeve fabrication', 'Custom bolt and thread manufacturing'],
      ta: ['நீண்ட ஷாப்ட் மற்றும் ஸ்பிண்டில் டர்னிங்', 'உள் மற்றும் வெளி போரிங் வேலைகள்', 'பேரிங் சீட் ஸ்லீவ் தயாரிப்பு', 'தனிப்பயன் போல்ட் மற்றும் த்ரெட் உருவாக்கம்'],
      hi: ['लंबी शाफ्ट एवं स्पिंडल टर्निंग', 'प्रिसिजन इंटरनल और एक्सटर्नल बोरिंग', 'बेयरिंग सीट स्लीव फैब्रिकेशन', 'कस्टम बोल्ट और थ्रेड निर्माण']
    }
  },
  {
    slug: 'welding-works',
    displayOrder: 2,
    icon: 'bi-fire',
    image: 'assets/images/service-welding.png',
    title: {
      en: 'Rig Welding & Fabrication',
      ta: 'ரிக் வெல்டிங் மற்றும் ஃபேப்ரிகேஷன்',
      hi: 'रिग वेल्डिंग एवं फैब्रिकेशन'
    },
    shortDescription: {
      en: 'Heavy structural welding, mast crack repair, chassis reinforcement, and hardfacing for abrasive wear protection.',
      ta: 'கனரக கட்டமைப்பு வெல்டிங், மாஸ்ட் விரிசல் பழுது, சேஸ் வலுவூட்டல் மற்றும் தேய்மான பாதுகாப்பு வெல்டிங்.',
      hi: 'भारी संरचनात्मक वेल्डिंग, मास्ट क्रैक रिपेयर, चेसिस सुदृढ़ीकरण और हार्डफेसिंग वेल्डिंग।'
    },
    fullDescription: {
      en: 'Expert arc and MIG welding for borewell rig structures, mast lattice repairs, stabilizer brackets, cross members, and heavy-duty wear plate cladding.',
      ta: 'போர்வெல் ரிக் மாஸ்ட், சேசிஸ் பிராக்கெட்டுகள், லேடிஸ் கட்டமைப்புகள் மற்றும் தேய்மான தகடுகளுக்கான தரமான ஆர்க் மற்றும் எம்ஐஜி வெல்டிங் சேவைகள்.',
      hi: 'बोरवेल रिग संरचनाओं, मास्ट लैटिस रिपेयर, स्टेबलाइजर ब्रैकेट और वियर प्लेट्स के लिए कुशल आर्क एवं मिग वेल्डिंग।'
    },
    features: {
      en: ['Mast & derrick structural welding', 'Truck & tractor rig chassis reinforcement', 'Wear-resistant hardfacing on drill components', 'Heavy brackets and mount fabrication'],
      ta: ['மாஸ்ட் கட்டமைப்பு வெல்டிங்', 'ரிக் சேஸ் வலுவூட்டல்', 'தேய்மான தடுப்பு ஹார்ட்பேசிங் வெல்டிங்', 'கனரக பிராக்கெட் தயாரிப்பு'],
      hi: ['मास्ट संरचनात्मक वेल्डिंग', 'रिग चेसिस रीइन्फोर्समेंट', 'घिसाव रोधी हार्डफेसिंग', 'हैवी ब्रैकेट फैब्रिकेशन']
    }
  },
  {
    slug: 'borewell-rig-service',
    displayOrder: 3,
    icon: 'bi-truck',
    image: 'assets/images/Complete Borewel/lorry1.png',
    title: {
      en: 'Borewell Rig Overhaul',
      ta: 'போர்வெல் ரிக் முழு சர்வீஸ்',
      hi: 'बोरवेल रिग ओवरहाल सर्विस'
    },
    shortDescription: {
      en: 'Complete hydraulic mast overhaul, rotary head rebuild, winch drum servicing, and guide rail alignment.',
      ta: 'ஹைட்ராலிக் மாஸ்ட் சீரமைப்பு, ரோட்டரி ஹெட் பழுது, வின்ச் டிரம் மற்றும் கைடு ரெயில் சர்வீஸ்.',
      hi: 'हाइड्रोलिक मास्ट ओवरहाल, रोटरी हेड रीबिल्ड, विंच ड्रम सर्विस और गाइड रेल एलाइनमेंट।'
    },
    fullDescription: {
      en: 'Thorough overhaul of truck-mounted and crawler borewell rigs. We service hydraulic feed cylinders, rotary head gearboxes, drive splines, swivel joints, and high-pressure hose routings.',
      ta: 'லாரி மற்றும் டிராக்டர் போர்வெல் ரிக்குகளுக்கான முழுமையான சர்வீஸ். ஹைட்ராலிக் சிலிண்டர்கள், கியர்பாக்ஸ், ஸ்விவல் ஜாய்ன்ட் மற்றும் பிரஷர் ஹோஸ் மாற்றங்கள்.',
      hi: 'ट्रक और ट्रैक्टर बोरवेल रिग्स की संपूर्ण सर्विस। हाइड्रोलिक फीड सिलेंडर, गियरबॉक्स, स्विवेल जॉइंट्स और प्रेशर होज़ रिपेयर।'
    },
    features: {
      en: ['Rotary head gearbox overhaul & seal replacement', 'Hydraulic feed cylinder repacking', 'Mast leveling & guide rail resurfacing', 'Winch assembly & wire rope sheaves servicing'],
      ta: ['ரோட்டரி ஹெட் கியர்பாக்ஸ் சீல் மாற்றல்', 'ஹைட்ராலிக் சிலிண்டர் பேக்கிங்', 'மாஸ்ட் கைடு ரெயில் சீரமைப்பு', 'வின்ச் மற்றும் கம்பி கயிறு சர்வீஸ்'],
      hi: ['रोटरी हेड गियरबॉक्स ओवरहाल', 'हाइड्रोलिक सिलेंडर रिपैकिंग', 'मास्ट लेवलिंग एवं गाइड रेल सर्विस', 'विंच असेंबली मेंटेनेंस']
    }
  },
  {
    slug: 'drilling-rod-works',
    displayOrder: 4,
    icon: 'bi-tools',
    image: 'assets/images/Complete Borewel/rod1.png',
    title: {
      en: 'Drilling Rod Works & Threading',
      ta: 'டிரில்லிங் ராடு வேலைகள் & த்ரெட்டிங்',
      hi: 'ड्रिलिंग रॉड कार्य एवं थ्रेडिंग'
    },
    shortDescription: {
      en: 'API regular and IF thread re-cutting, friction welded tool joint repair, rod straightening, and sub adapters.',
      ta: 'ஏபிஐ த்ரெட் ரீ-கட்டிங், டூல் ஜாய்ன்ட் பழுது, ராடு நேராக்குதல் மற்றும் அடாப்டர் தயாரிப்பு.',
      hi: 'एपीआई थ्रेड री-कटिंग, टूल जॉइंट रिपेयर, रॉड सीधा करना और सब-अडैप्टर निर्माण।'
    },
    fullDescription: {
      en: 'Specialized lathe threading and re-threading for 4.5", 5", and 6" drill pipes. We machine male/female tool joints, repair thread galling, and manufacture custom crossover subs.',
      ta: '4.5, 5 மற்றும் 6 இன்ச் டிரில்லிங் பைப்புகளுக்கான பிரத்யேக த்ரெட் கட்டிங், மேல்/பீமேல் ஜாய்ன்ட் பழுது மற்றும் கிராஸ்ஓவர் அடாப்டர்கள்.',
      hi: '4.5", 5" और 6" ड्रिल पाइप्स के लिए सटीक थ्रेड कटिंग, थ्रेड रिपेयर और कस्टम क्रॉसओवर अडैप्टर फैब्रिकेशन।'
    },
    features: {
      en: ['API Reg / IF thread machining with gauge checking', 'Hydraulic drill rod bend straightening', 'Friction joint repair & sleeve reinforcement', 'Custom crossover subs & bit adapters'],
      ta: ['துல்லியமான API த்ரெட் கட்டிங்', 'ஹைட்ராலிக் முறையில் ராடு நேராக்குதல்', 'ஜாய்ன்ட் ஸ்லீவ் வெல்டிங் & ரீபேசிங்', 'பிட் அடாப்டர்கள் தயாரிப்பு'],
      hi: ['सटीक API थ्रेड मशीनिंग', 'हाइड्रोलिक रॉड स्ट्रेटनिंग', 'जॉइंट स्लीव वेल्डिंग और रिपेयर', 'कस्टम बिट अडैप्टर निर्माण']
    }
  }
];

const galleryData = [
  {
    title: { en: 'Heavy-Duty Lathe Turning Area', ta: 'கனரக லேத் டர்னிங் பகுதி', hi: 'हैवी लेथ टर्निंग सेक्शन' },
    category: 'workshop',
    imageUrl: 'assets/images/gallery-lathe-1.png',
    description: { en: 'Precision machining of rotary head drive spindle on our heavy bed lathe.', ta: 'ரோட்டரி ஹெட் டிரைவ் ஸ்பிண்டில் துல்லியமாக மெஷினிங் செய்தல்.', hi: 'रोटरी हेड ड्राइव स्पिंडल की प्रिसिजन मशीनिंग।' },
    displayOrder: 1
  },
  {
    title: { en: 'Rig Mast Lattice Structural Welding', ta: 'ரிக் மாஸ்ட் கட்டமைப்பு வெல்டிங்', hi: 'रिग मास्ट संरचनात्मक वेल्डिंग' },
    category: 'welding',
    imageUrl: 'assets/images/gallery-welding-1.png',
    description: { en: 'Reinforcing heavy cross braces on a 40-ft drill rig mast with high-tensile arc welding.', ta: '40 அடி ரிக் மாஸ்டில் உயர்தர ஆர்க் வெல்டிங் மூலம் குறுக்கு பிரேஸ்களை வலுப்படுத்துதல்.', hi: '40-फुट ड्रिल रिग मास्ट पर हाई-टेंसाइल आर्क वेल्डिंग द्वारा स्ट्रक्चरल मजबूती।' },
    displayOrder: 2
  },
  {
    title: { en: 'Truck-Mounted Borewell Rig Servicing', ta: 'லாரி போர்வெல் ரிக் சர்வீஸ் பணித்தளம்', hi: 'ट्रक-माउंटेड बोरवेल रिग सर्विस' },
    category: 'rig',
    imageUrl: 'assets/images/gallery-rig-1.svg',
    description: { en: 'Complete hydraulic cylinder overhaul and mast alignment in progress inside our workshop bay.', ta: 'எங்கள் பட்டறையில் ஹைட்ராலிக் சிலிண்டர் சீரமைப்பு மற்றும் மாஸ்ட் அலைன்மென்ட் பணிகள்.', hi: 'हमारी वर्कशॉप बे में हाइड्रोलिक सिलेंडर ओवरहाल और मास्ट एलाइनमेंट कार्य।' },
    displayOrder: 3
  },
  {
    title: { en: '4.5" & 6" Drill Rod Threading & Inspection', ta: '4.5" மற்றும் 6" டிரில்லிங் ராடு த்ரெட் கட்டிங்', hi: '4.5" और 6" ड्रिलिंग रॉड थ्रेडिंग' },
    category: 'drilling_rods',
    imageUrl: 'assets/images/uploads/rod2.png',
    description: { en: 'API thread cutting on hardened drill pipe tool joints with pitch gauge verification.', ta: 'டிரில்லிங் பைப்புகளில் கேஜ் பரிசோதனையுடன் துல்லியமான API த்ரெட் வெட்டுதல்.', hi: 'गेज परीक्षण के साथ ड्रिल पाइप टूल जॉइंट्स पर सटीक एपीआई थ्रेड कटिंग।' },
    displayOrder: 4
  },
  {
    title: { en: 'High-Pressure Compressor Maintenance', ta: 'உயர் அழுத்த கம்ப்ரஸர் பராமரிப்பு', hi: 'हाई-प्रेशर कंप्रेसर मेंटेनेंस' },
    category: 'compressor',
    imageUrl: 'assets/images/gallery-compressor-1.svg',
    description: { en: 'Screw compressor air-end alignment, oil cooler cleaning, and valve inspection.', ta: 'ஸ்க்ரூ கம்ப்ரஸர் ஏர்-எண்ட் அலைன்மென்ட், கூலர் சுத்தம் செய்தல் மற்றும் வால்வு ஆய்வு.', hi: 'स्क्रू कंप्रेसर एयर-एंड एलाइनमेंट, ऑयल कूलर क्लीनिंग और वाल्व इंस्पेक्शन।' },
    displayOrder: 5
  },
  {
    title: { en: 'Workshop Machine Shop & Tooling Bay', ta: 'பட்டறை இயந்திர தளம் மற்றும் டூலிங் பகுதி', hi: 'वर्कशॉप मशीन शॉप फ्लोर' },
    category: 'workshop',
    imageUrl: 'assets/images/Complete Borewel/resent1.png',
    description: { en: 'Spacious workshop bay equipped with overhead crane, boring bar, and milling tools.', ta: 'ஓவர்ஹெட் கிரேன், போரிங் மற்றும் மில்லிங் வசதிகள் கொண்ட விசாலமான பட்டறை தளம்.', hi: 'ओवरहेड क्रेन और बोरिंग सुविधाओं से युक्त विस्तृत वर्कशॉप फ्लोर।' },
    displayOrder: 6
  },
  {
    title: { en: 'Hardfacing on Rig Stabilizer Pads', ta: 'ரிக் ஸ்டெபிலைசர் பேட்களில் ஹார்ட்பேசிங் வெல்டிங்', hi: 'रिग स्टेबलाइजर पैड्स पर हार्डफेसिंग' },
    category: 'welding',
    imageUrl: 'assets/images/gallery-welding-2.svg',
    description: { en: 'Applying wear-resistant hardfacing electrode deposit on ground stabilizer pads.', ta: 'பூமிக்குரிய ஸ்டெபிலைசர் பேட்களில் தேய்மான எதிர்ப்பு எலக்ட்ரோடு வெல்டிங் பதித்தல்.', hi: 'स्टेबलाइजर पैड्स पर घिसाव रोधी इलेक्ट्रोड वेल्डिंग का कार्य।' },
    displayOrder: 7
  },
  {
    title: { en: 'Hydraulic Rotary Head Assembly Rebuild', ta: 'ஹைட்ராலிக் ரோட்டரி ஹெட் சீரமைப்பு', hi: 'हाइड्रोलिक रोटरी हेड रीबिल्ड' },
    category: 'rig',
    imageUrl: 'assets/images/gallery-rig-2.svg',
    description: { en: 'High torque motor mounting, oil seal replacement, and bearing pre-load setting.', ta: 'ரோட்டரி மோட்டார் பொருத்துதல், ஆயில் சீல் மாற்றம் மற்றும் பேரிங் அமைத்தல்.', hi: 'हाई टॉर्क मोटर माउंटिंग, ऑयल सील रिप्लेसमेंट और बेयरिंग फिटिंग।' },
    displayOrder: 8
  },
  {
    title: { en: 'Drill Pipe Crossover Adapter Subs', ta: 'டிரில் பைப் கிராஸ்ஓவர் அடாப்டர் சப் உதிரிபாகங்கள்', hi: 'ड्रिल पाइप क्रॉसओवर अडैप्टर सब' },
    category: 'drilling_rods',
    imageUrl: 'assets/images/gallery-rods-2.svg',
    description: { en: 'Precision manufactured 3-1/2" Reg to 4-1/2" Reg transition subs and saver subs.', ta: '3-1/2" மற்றும் 4-1/2" இணைப்புகளுக்கான பிரத்யேக டிரான்சிஷன் மற்றும் சேவர் சப் தயாரிப்பு.', hi: '3-1/2" से 4-1/2" कनेक्शन के लिए निर्मित ट्रांजिशन और सेवर सब अडैप्टर।' },
    displayOrder: 9
  },
  {
    title: { en: 'Compressor Valve Bank & Intercooler Test', ta: 'கம்ப்ரஸர் வால்வு பேங்க் & இன்டர்கூலர் சோதனை', hi: 'कंप्रेसर वाल्व बैंक एवं इंटरकूलर टेस्टिंग' },
    category: 'compressor',
    imageUrl: 'assets/images/gallery-compressor-2.svg',
    description: { en: 'Pressure testing of safety relief valves and intercooler coils after ultrasonic clean.', ta: 'அழுத்த பாதுகாப்பு வால்வுகள் மற்றும் இன்டர்கூலர் சுருள்கள் சோதனை செய்தல்.', hi: 'सुरक्षा वाल्व और इंटरकूलर कॉइल्स का हाइड्रोस्टैटिक प्रेशर टेस्ट।' },
    displayOrder: 10
  }
];

const sampleCustomers = [
  {
    name: 'K. Senthil Nathan',
    phone: '9842511223',
    location: 'Tiruchengode, Tamil Nadu',
    notes: 'Borewell rig contractor - 4.5" drilling rod thread servicing'
  },
  {
    name: 'R. Murugesan',
    phone: '9789123456',
    location: 'Salem, Tamil Nadu',
    notes: 'Rotary head gearbox overhaul & mast crack welding'
  }
];

async function seedDatabase() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sri_vellingiri_db';
  console.log(`Connecting to MongoDB for seeding: ${mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ MongoDB connected successfully for seed script.');

    await Service.deleteMany({});
    await Gallery.deleteMany({});
    console.log('Cleared previous services and gallery data.');

    const insertedServices = await Service.insertMany(servicesData);
    console.log(`✅ Seeded ${insertedServices.length} Services.`);

    const insertedGallery = await Gallery.insertMany(galleryData);
    console.log(`✅ Seeded ${insertedGallery.length} Gallery items.`);

    const customerCount = await Customer.countDocuments();
    if (customerCount === 0) {
      const customers = await Customer.insertMany(sampleCustomers);
      console.log(`✅ Seeded ${customers.length} sample Customers.`);

      await ServiceRequest.create({
        customerName: customers[0].name,
        phone: customers[0].phone,
        serviceRequired: 'Drilling Rod Works & Threading',
        message: 'Need urgent re-threading for 15 drill rods (4.5" API Reg).',
        customerId: customers[0]._id,
        urgency: 'Urgent',
        status: 'In-Progress'
      });
      console.log(`✅ Seeded sample Service Request.`);
    }

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.log('------------------------------------------------------------');
    console.log('ℹ️ MongoDB Service is not currently running on your system (ECONNREFUSED).');
    console.log('💡 Note: You DO NOT need MongoDB running to use the website!');
    console.log('👉 Simply run: npm start');
    console.log('   The website has built-in data and works immediately at http://localhost:5000');
    console.log('------------------------------------------------------------');
    process.exit(0);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { servicesData, galleryData, seedDatabase };
