import mongoose from 'mongoose';
import { Scheme } from '@models/Scheme.model.js';
import dotenv from 'dotenv';

dotenv.config();

const SCHEMES = [
  {
    _id: new mongoose.Types.ObjectId(),
    schemeId: 'pm-kisan',
    name: {
      en: 'PM-KISAN',
      hi: 'पीएम-किसान',
      mr: 'पीएम-किसान',
      ta: 'பிஎம்-கிசான்',
    },
    description: {
      en: 'Pradhan Mantri Kisan Samman Nidhi - Income support of Rs 6000/year to small and marginal farmers',
      hi: 'प्रधानमंत्री किसान सम्मान निधि - छोटे और सीमांत किसानों को 6000 रुपये वार्षिक आय सहायता',
      mr: 'प्रधानमंत्री किसान सन्मान निधी - लहान आणि सीमांत शेतकऱ्यांना वार्षिक ₹6000 उत्पन्न सहाय्य',
      ta: 'பிரதான் மந்திரி கிசான் சம்மான் நிதி - சிறு விவசாயிகளுக்கு ஆண்டுக்கு ₹6000 வருமான ஆதரவு',
    },
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    benefits: {
      financial: { amount: 6000, type: 'direct_benefit_transfer', frequency: 'annual' },
      nonFinancial: ['Direct Bank Transfer in 3 installments', 'No middlemen'],
    },
    eligibilityRules: {
      maxLandholding: 2.0,
      allowedCategories: ['general', 'obc', 'sc', 'st', 'ews'],
      allowedStates: [],
      minAge: 18,
    },
    requiredDocuments: ['Aadhaar Card', 'Bank Account Details', 'Land Records (Khasra/Khatauni)', 'Mobile Number'],
    applicationDeadline: null,
    officialUrl: 'https://pmkisan.gov.in',
    pdfUrl: 'https://pmkisan.gov.in/Documents/Pradhan_Mantri_Kisan_Samman_Nidhi.pdf',
    status: 'active',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    schemeId: 'pm-kusum',
    name: {
      en: 'PM-KUSUM',
      hi: 'पीएम-कुसुम',
      mr: 'पीएम-कुसुम',
      ta: 'பிஎம்-குசும்',
    },
    description: {
      en: 'PM Kisan Urja Suraksha evam Utthaan Mahabhiyan - Solar pump and grid connected solar power plant for farmers',
      hi: 'प्रधानमंत्री किसान ऊर्जा सुरक्षा एवं उत्थान महाभियान - किसानों के लिए सोलर पंप और सोलर पावर प्लांट',
      mr: 'पंतप्रधान किसान ऊर्जा सुरक्षा आणि उत्थान महाभियान - शेतकऱ्यांसाठी सौर पंप आणि सौर ऊर्जा संयंत्र',
      ta: 'பிரதான் மந்திரி கிசான் ஆற்றல் பாதுகாப்பு மேலான் மகாபியான் - விவசாயிகளுக்கு சூரிய பம்ப்',
    },
    ministry: 'Ministry of New and Renewable Energy',
    benefits: {
      financial: { amount: 0, type: 'subsidy', frequency: 'one_time' },
      nonFinancial: ['60% subsidy on solar pump', 'Extra power can be sold to grid', 'Reduces diesel cost'],
    },
    eligibilityRules: {
      maxLandholding: 0,
      allowedCategories: ['general', 'obc', 'sc', 'st', 'ews'],
      allowedStates: [],
      minAge: 18,
    },
    requiredDocuments: ['Aadhaar Card', 'Land Records', 'Bank Account', 'Electricity Bill'],
    applicationDeadline: null,
    officialUrl: 'https://mnre.gov.in',
    pdfUrl: 'https://mnre.gov.in/img/documents/PM-KUSUM-Guideline.pdf',
    status: 'active',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    schemeId: 'agri-infra-fund',
    name: {
      en: 'Agriculture Infrastructure Fund',
      hi: 'कृषि अवसंरचना कोष',
      mr: 'कृषी पायाभूत सुविधा निधी',
      ta: 'விவசாய உள்கட்டமைப்பு நிதி',
    },
    description: {
      en: 'Medium-long term debt financing for post-harvest management infrastructure and community farming assets',
      hi: 'फसल के बाद प्रबंधन बुनियादी ढांचे के लिए मध्यम-दीर्घकालिक ऋण वित्तपोषण',
      mr: 'कापणीनंतर व्यवस्थापन पायाभूत सुविधांसाठी मध्यम-दीर्घकालीन कर्ज वित्तपुरवठा',
      ta: 'அறுவடை பிந்தைய மேலாண்மை உள்கட்டமைப்புக்கு நடுத்தர-நீண்ட கால கடன் நிதி',
    },
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    benefits: {
      financial: { amount: 200000000, type: 'loan', frequency: 'one_time' },
      nonFinancial: ['3% interest subvention', 'Credit guarantee cover', 'Up to Rs 2 crore loan'],
    },
    eligibilityRules: {
      maxLandholding: 0,
      allowedCategories: ['general', 'obc', 'sc', 'st', 'ews'],
      allowedStates: [],
      minAge: 18,
    },
    requiredDocuments: ['Aadhaar Card', 'Business Plan', 'Land Records', 'Bank Statement', 'Project Report'],
    applicationDeadline: null,
    officialUrl: 'https://agriinfra.dac.gov.in',
    pdfUrl: 'https://agriinfra.dac.gov.in/Content/PDF/AIF_Operational_Guidelines.pdf',
    status: 'active',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('Connected to MongoDB');

  for (const scheme of SCHEMES) {
    await Scheme.findOneAndUpdate(
      { schemeId: scheme.schemeId },
      scheme,
      { upsert: true, new: true }
    );
    console.log(`Seeded: ${scheme.name.en}`);
  }

  console.log('Seeding complete');
  await mongoose.disconnect();
}

seed().catch(console.error);