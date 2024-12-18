const { areasOfCountry, carriersOf, countryCodeOf } = require('../areasOfCountry')

const format = (cc, n) => `+${cc}(${n.toString().padStart(2, '0')})`

/* global process */
require('dotenv').config()
const HIDE_BANK_PAYMENT = process.env.HIDE_BANK_PAYMENT
const SELF_URL = process.env.SELF_URL
const FREE_LINKS = Number(process.env.FREE_LINKS)
const SUPPORT_USERNAME = process.env.SUPPORT_USERNAME

const HIDE_SMS_APP = process.env.HIDE_SMS_APP
const HIDE_BECOME_RESELLER = process.env.HIDE_BECOME_RESELLER
const TG_HANDLE = process.env.TG_HANDLE
const TG_CHANNEL = process.env.TG_CHANNEL
const SMS_APP_NAME = process.env.SMS_APP_NAME
const SMS_APP_LINK = process.env.SMS_APP_LINK
const CHAT_BOT_NAME = process.env.CHAT_BOT_NAME
const CHAT_BOT_BRAND = process.env.CHAT_BOT_BRAND
const SUPPORT_HANDLE = process.env.SUPPORT_HANDLE
const APP_SUPPORT_LINK = process.env.APP_SUPPORT_LINK

const PRICE_DAILY = Number(process.env.PRICE_DAILY_SUBSCRIPTION)
const PRICE_WEEKLY = Number(process.env.PRICE_WEEKLY_SUBSCRIPTION)
const PRICE_MONTHLY = Number(process.env.PRICE_MONTHLY_SUBSCRIPTION)
const DAILY_PLAN_FREE_DOMAINS = Number(process.env.DAILY_PLAN_FREE_DOMAINS)
const WEEKLY_PLAN_FREE_DOMAINS = Number(process.env.WEEKLY_PLAN_FREE_DOMAINS)
const FREE_LINKS_HOURS = Number(process.env.FREE_LINKS_TIME_SECONDS) / 60 / 60
const MONTHLY_PLAN_FREE_DOMAINS = Number(process.env.MONTHLY_PLAN_FREE_DOMAINS)

const HOSTING_STARTER_PLAN_PRICE = parseFloat(process.env.HOSTING_STARTER_PLAN_PRICE)
const HOSTING_PRO_PLAN_PRICE = parseFloat(process.env.HOSTING_PRO_PLAN_PRICE)
const HOSTING_BUSINESS_PLAN_PRICE = parseFloat(process.env.HOSTING_BUSINESS_PLAN_PRICE)

const npl = {
  // New Zealand
  Spark: ['Spark'],
  Vocus: ['Vocus'],
  '2Degrees/Voyager': ['Voyager'],
  'Skinny Mobile': ['Skinny Mobile'],
  // Australia
  Telstra: ['Telstra'],
  Optus: ['Optus'],
  Vodafone: ['VODAFONE', 'Vodafone'],
  // UK
  EE: ['EE'],
  Three: ['Three'],
  'Virgin/O2': ['Virgin'],
}

const alcazar = {
  'T-mobile': ['T-MOBILE', 'OMNIPOINT', 'METROPCS', 'SPRINT', 'AERIAL'],
  'Metro PCS': ['T-MOBILE', 'OMNIPOINT', 'METROPCS', 'SPRINT', 'AERIAL'],
  Sprint: ['T-MOBILE', 'OMNIPOINT', 'METROPCS', 'SPRINT', 'AERIAL'],
  'Verizon Wireless': ['CELLCO', 'ONVOY'],
  'AT&T': ['CINGULAR'],
}

// Note: these button labels must not mix with each other, other wise it may mess up bot
const admin = {
  viewAnalytics: '📊 विश्लेषण देखें',
  viewUsers: '👀 उपयोगकर्ता देखें',
  blockUser: '✋ उपयोगकर्ता को ब्लॉक करें',
  unblockUser: '👌 उपयोगकर्ता को अनब्लॉक करें',
  messageUsers: '👋 सभी उपयोगकर्ताओं को संदेश भेजें',
}
const user = {
  // main keyboards
  cPanelWebHostingPlans: 'निजी cPanel होस्टिंग प्लान 🔒',
  pleskWebHostingPlans: 'निजी Plesk होस्टिंग प्लान 🔒',
  joinChannel: '📢 चैनल जॉइन करें',
  phoneNumberLeads: '📲 HQ एसएमएस लीड',
  wallet: '👛 मेरा वॉलेट',
  urlShortenerMain: '🔗✂️ URL छोटा करें',
  buyPlan: '🔔 यहां सब्सक्राइब करें',
  domainNames: '🌐 डोमेन नाम',
  viewPlan: '🔔 मेरा प्लान',
  becomeReseller: '💼 पुनर्विक्रेता बनें',
  getSupport: '💬 सहायता प्राप्त करें',
  freeTrialAvailable: '📧🆓 BulkSMS - फ्री ट्रायल',
  changeSetting: '🌍 सेटिंग्स बदलें',

  // Sub Menu 1: urlShortenerMain
  redSelectUrl: '🔀✂️ रीडायरेक्ट और छोटा करें',
  urlShortener: '✂️🌐 कस्टम डोमेन शॉर्टनर',
  viewShortLinks: '📊 शॉर्टलिंक एनालिटिक्स देखें',

  // Sub Menu 2: domainNames
  buyDomainName: '🛒🌐 डोमेन नाम खरीदें',
  viewDomainNames: '📂 मेरे डोमेन नाम',
  dnsManagement: '🔧 DNS प्रबंधन',

  // Sub Menu 3: cPanel/Plesk WebHostingPlansMain
  freeTrial: '💡 फ्री ट्रायल',
  starterPlan: '🔼 स्टार्टर प्लान',
  proPlan: '🔷 प्रो प्लान',
  businessPlan: '👑 बिज़नेस प्लान',
  contactSupport: '📞 समर्थन से संपर्क करें',

  // Free Trial
  freeTrialMenuButton: '🚀 फ्री ट्रायल (12 घंटे)',
  getFreeTrialPlanNow: '🛒 अभी ट्रायल प्लान प्राप्त करें',
  continueWithDomainNameSBS: websiteName => `➡️ ${websiteName} के साथ जारी रखें`,
  searchAnotherDomain: '🔍 दूसरा डोमेन खोजें',
  privHostNS: '🏢 PrivHost (तेज़ और सुरक्षित होस्टिंग)',
  cloudflareNS: '🛡️ Cloudflare शील्ड (सुरक्षा और गुप्तता)',
  backToFreeTrial: '⬅️ फ्री ट्रायल पर वापस जाएं',

  // Paid Plans
  buyStarterPlan: '🛒 स्टार्टर प्लान खरीदें',
  buyProPlan: '🛒 प्रो प्लान खरीदें',
  buyBusinessPlan: '🛒 बिज़नेस प्लान खरीदें',
  viewStarterPlan: '🔷 स्टार्टर प्लान देखें',
  viewProPlan: '🔼 प्रो प्लान देखें',
  viewBusinessPlan: '👑 बिज़नेस प्लान देखें',
  backToHostingPlans: '⬅️ होस्टिंग प्लान्स पर वापस जाएं',
  registerANewDomain: '🌐 नया डोमेन पंजीकृत करें',
  useExistingDomain: '🔄 मौजूदा डोमेन का उपयोग करें',
  backToStarterPlanDetails: '⬅️ स्टार्टर प्लान विवरण पर वापस जाएं',
  backToProPlanDetails: '⬅️ प्रो प्लान विवरण पर वापस जाएं',
  backToBusinessPlanDetails: '⬅️ बिज़नेस प्लान विवरण पर वापस जाएं',
  continueWithDomain: websiteName => `➡️ ${websiteName} के साथ जारी रखें`,
  enterAnotherDomain: '🔍 दूसरा डोमेन दर्ज करें',
  backToPurchaseOptions: '⬅️ खरीद विकल्पों पर वापस जाएं',
}

const u = {
  // other key boards
  deposit: '➕💵 जमा',
  withdraw: '➖💵 वापस लें',

  // wallet
  usd: 'USD',
  ngn: 'NGN',
}
const view = num => Number(num).toFixed(2)
const yesNo = ['हाँ', 'नहीं']

const bal = (usd, ngn) =>
  HIDE_BANK_PAYMENT !== 'true'
    ? `$${view(usd)}
₦${view(ngn)}`
    : `$${view(usd)}`

const t = {
  yes: 'हाँ',
  no: 'नहीं',
  back: 'वापस',
  cancel: 'रद्द करें',
  skip: 'छोड़ें',
  becomeReseller: `नमस्ते,

मैं आपको ${CHAT_BOT_BRAND}Bot के शक्तिशाली एसएमएस मार्केटिंग और होस्टिंग सॉफ़्टवेयर का पुनर्विक्रेता बनने का एक शानदार अवसर प्रदान करने के लिए संपर्क कर रहा हूँ।

मुख्य विवरण:

लाभ साझेदारी: प्रत्येक बिक्री पर 65/35% का प्रतिस्पर्धी हिस्सा कमाएं।

सेट-अप शुल्क: विवरण के लिए समर्थन से संपर्क करें।

रुचि है? इस लाभदायक साझेदारी के बारे में अधिक जानने के लिए ${SUPPORT_HANDLE} पर हमसे संपर्क करें।

आपके साथ संभावित सहयोग की प्रतीक्षा है!

शुभकामनाएँ,

${CHAT_BOT_BRAND} टीम
`,
  resetLoginAdmit: `${CHAT_BOT_BRAND} एसएमएस: आप अपने पिछले डिवाइस से सफलतापूर्वक लॉग आउट हो गए हैं। कृपया अब लॉग इन करें।`,
  resetLoginDeny: 'ठीक है, कोई और कार्रवाई की आवश्यकता नहीं है।',
  resetLogin: `${CHAT_BOT_BRAND} एसएमएस: क्या आप अपने पिछले डिवाइस से लॉग आउट करने की कोशिश कर रहे हैं?`,
  select: `कृपया एक विकल्प चुनें:`,

  // cPanel/Plesk Plans initial select plan text
  selectPlan: `कृपया एक योजना चुनें:`,
  backButton: '⬅️ वापस',
  yesProceedWithThisEmail: email => `➡️ ${email} के साथ आगे बढ़ें`,
  proceedWithPayment: '➡️ भुगतान के साथ आगे बढ़ें',
  iHaveSentThePayment: `मैंने भुगतान भेज दिया है ✅`,
  trialAlreadyUsed: `आपने पहले ही अपना मुफ्त ट्रायल उपयोग कर लिया है। यदि आपको अधिक पहुंच की आवश्यकता है, तो कृपया हमारे किसी भुगतान वाले योजना की सदस्यता लेने पर विचार करें।`,
  oneHourLeftToExpireTrialPlan: `आपकी Freedom योजना 1 घंटे में समाप्त होने वाली है। यदि आप हमारी सेवाओं का उपयोग जारी रखना चाहते हैं, तो भुगतान योजना में अपग्रेड करने पर विचार करें!`,
  freePlanExpired: `🚫 आपकी Freedom योजना समाप्त हो गई है। हमें उम्मीद है कि आपने अपना ट्रायल पसंद किया होगा। हमारी सेवाओं का उपयोग जारी रखने के लिए, कृपया हमारे प्रीमियम योजनाओं में से एक खरीदें।`,
  freeTrialPlanSelected: hostingType => `
- हमारे <b>Freedom योजना</b> को निःशुल्क आज़माएं! इस योजना में एक निःशुल्क डोमेन शामिल है, जिसका अंत .sbs पर होता है और यह 12 घंटे के लिए सक्रिय रहेगा।

🚀 <b>Freedom योजना:</b>
<b>- स्टोरेज:</b> 1 GB SSD
<b>- बैंडविड्थ:</b> 10 GB
<b>- डोमेन:</b> 1 निःशुल्क .sbs डोमेन
<b>- ईमेल खाते:</b> 1 ईमेल खाता
<b>- डेटाबेस:</b> 1 MySQL डेटाबेस
<b>- मुफ्त SSL:</b> हां
<b>- ${hostingType} सुविधाएँ:</b> ${hostingType} के लिए फ़ाइलें, डेटाबेस और ईमेल प्रबंधित करने हेतु पूर्ण पहुंच।
<b>- अवधि:</b> 12 घंटे तक सक्रिय
<b>- आदर्श उपयोग:</b> परीक्षण और लघुकालीन परियोजनाओं के लिए।
  `,

  getFreeTrialPlan: `कृपया अपनी इच्छित डोमेन नाम (उदा., example.sbs) दर्ज करें और इसे संदेश के रूप में भेजें। यह डोमेन .sbs में समाप्त होगा और आपके ट्रायल प्लान के साथ मुफ्त है।`,
  trialPlanContinueWithDomainNameSBSMatched: websiteName => `डोमेन ${websiteName} उपलब्ध है!`,
  trialPlanSBSDomainNotMatched: `आपके द्वारा दर्ज किया गया डोमेन नहीं मिला। कृपया सही डोमेन सुनिश्चित करें या किसी अन्य का उपयोग करें।`,
  trialPlanSBSDomainIsPremium: `डोमेन प्रीमियम मूल्य पर है और केवल भुगतान योजना के साथ उपलब्ध है। कृपया अन्य डोमेन खोजें।`,
  trialPlanGetNowInvalidDomain: `कृपया एक मान्य डोमेन नाम दर्ज करें जो '.sbs' पर समाप्त होता है। डोमेन 'example.sbs' जैसा दिखना चाहिए और आपके ट्रायल प्लान के साथ मुफ्त है।`,
  trialPlanNameserverSelection: websiteName => `कृपया ${websiteName} के लिए उपयोग करने के लिए नाम सर्वर प्रदाता चुनें।`,
  trialPlanDomainNameMatched: `कृपया अपना खाता बनाने और अपनी रसीद भेजने के लिए अपना ईमेल पता प्रदान करें।`,
  confirmEmailBeforeProceedingSBS: email =>
    `क्या आप निश्चित हैं कि आप इस ${email} ईमेल के साथ Freedom योजना सदस्यता के लिए आगे बढ़ना चाहते हैं?`,
  trialPlanInValidEmail: `कृपया एक मान्य ईमेल प्रदान करें।`,
  trialPlanActivationConfirmation: `धन्यवाद! आपका मुफ्त ट्रायल प्लान जल्द ही सक्रिय होगा। कृपया ध्यान दें, यह योजना केवल 12 घंटे के लिए सक्रिय रहेगी।`,
  trialPlanActivationInProgress: `आपका मुफ्त ट्रायल प्लान सक्रिय हो रहा है। इसमें कुछ क्षण लग सकते हैं...`,

  what: `कृपया कीबोर्ड से विकल्प चुनें।`,
  whatNum: `कृपया एक मान्य संख्या चुनें।`,
  phoneGenTimeout: `समय समाप्त।`,
  phoneGenNoGoodHits: `कृपया समर्थन से संपर्क करें ${SUPPORT_HANDLE} या किसी अन्य क्षेत्र कोड का चयन करें।`,

  subscribeRCS: p =>
    `सदस्यता ली गई! ${p} पर क्लिक करके कभी भी <a href="${SELF_URL}/unsubscribe?a=b&Phone=${p}">लिंक</a> से सदस्यता समाप्त करें।`,
  unsubscribeRCS: p =>
    `आपने सदस्यता समाप्त कर दी है! पुनः सदस्यता लेने के लिए <a href="${SELF_URL}/subscribe?a=b&Phone=${p}">लिंक</a> पर क्लिक करें।`,
  argsErr: `डिव: गलत तर्क भेजे गए।`,
  showDepositNgnInfo:
    ngn => `कृपया नीचे "भुगतान करें" पर क्लिक करके ${ngn} NGN भेजें। एक बार लेन-देन की पुष्टि हो जाने पर, आपको तुरंत सूचित किया जाएगा और आपका वॉलेट अपडेट कर दिया जाएगा।

सादर,  
${CHAT_BOT_NAME}`,
  askEmail: `कृपया भुगतान पुष्टि के लिए एक ईमेल प्रदान करें।`,
  askValidAmount: 'कृपया एक मान्य संख्या प्रदान करें।',
  askValidEmail: 'कृपया एक मान्य ईमेल प्रदान करें।',
  askValidCrypto: 'कृपया एक मान्य क्रिप्टो करेंसी चुनें।',
  askValidPayOption: 'कृपया एक मान्य भुगतान विकल्प चुनें।',
  chooseSubscription:
    HIDE_SMS_APP === 'true'
      ? `<b>हमारी सब्सक्रिप्शन योजनाओं के साथ अपनी ब्रांड को बढ़ावा दें!</b>

- <b>दैनिक:</b> $${PRICE_DAILY} के साथ ${DAILY_PLAN_FREE_DOMAINS} मुफ़्त ".sbs" डोमेन, असीमित URL शॉर्टनर।  
- <b>साप्ताहिक:</b> $${PRICE_WEEKLY} के साथ ${WEEKLY_PLAN_FREE_DOMAINS} मुफ़्त ".sbs" डोमेन, असीमित URL शॉर्टनर।  
- <b>मासिक:</b> $${PRICE_MONTHLY} के साथ ${MONTHLY_PLAN_FREE_DOMAINS} मुफ़्त ".sbs" डोमेन, असीमित URL शॉर्टनर।  

(केवल ".sbs" डोमेन के लिए।)`
      : `<b>हमारी सब्सक्रिप्शन योजनाओं के साथ अपनी ब्रांड को बढ़ावा दें!</b>

- <b>दैनिक:</b> $${PRICE_DAILY} के साथ ${DAILY_PLAN_FREE_DOMAINS} मुफ़्त ".sbs" डोमेन, असीमित URL शॉर्टनर और असीमित BulkSMS।  
- <b>साप्ताहिक:</b> $${PRICE_WEEKLY} के साथ ${WEEKLY_PLAN_FREE_DOMAINS} मुफ़्त ".sbs" डोमेन, असीमित URL शॉर्टनर और असीमित BulkSMS।  
- <b>मासिक:</b> $${PRICE_MONTHLY} के साथ ${MONTHLY_PLAN_FREE_DOMAINS} मुफ़्त ".sbs" डोमेन, असीमित URL शॉर्टनर और असीमित BulkSMS।  

(केवल ".sbs" डोमेन के लिए।)`,

  askCoupon: usd =>
    `मूल्य $${usd} है। क्या आप कूपन कोड लगाना चाहेंगे? यदि आपके पास है, तो कृपया इसे अभी दर्ज करें। अन्यथा, "स्किप" पर क्लिक करें।`,
  planAskCoupon: `क्या आप कूपन कोड लगाना चाहेंगे? यदि आपके पास है, तो कृपया इसे अभी दर्ज करें। अन्यथा, "स्किप" पर क्लिक करें।`,
  enterCoupon: `कृपया एक कूपन कोड दर्ज करें:`,
  planPrice: (plan, price) => `${plan} सब्सक्रिप्शन की कीमत $${price} है। कृपया भुगतान विधि चुनें।`,
  planNewPrice: (plan, price, newPrice) =>
    `${plan} सब्सक्रिप्शन की कीमत अब $${view(newPrice)} <s>($${price})</s> है। कृपया भुगतान विधि चुनें।`,
  domainPrice: (domain, price) => `${domain} डोमेन की कीमत $${price} USD है। भुगतान विधि चुनें।`,
  domainNewPrice: (domain, price, newPrice) =>
    `${domain} डोमेन की कीमत अब $${view(newPrice)} <s>($${price})</s> है। भुगतान विधि चुनें।`,
  couponInvalid: `अमान्य कूपन कोड। कृपया पुनः कूपन कोड दर्ज करें:`,
  lowPrice: `भेजी गई कीमत आवश्यक से कम है।`,
  freeTrialAvailable: `आपका BulkSMS नि:शुल्क परीक्षण अब सक्षम है। कृपया ${SMS_APP_LINK} पर ${SMS_APP_NAME} Android ऐप डाउनलोड करें। क्या आपको ई-सिम कार्ड की ज़रूरत है? ${SUPPORT_HANDLE} से संपर्क करें।`,
  freeTrialNotAvailable: `आप पहले ही नि:शुल्क परीक्षण का उपयोग कर चुके हैं।`,
  planSubscribed:
    HIDE_SMS_APP === 'true'
      ? `आपने {{plan}} प्लान को सफलतापूर्वक सब्सक्राइब कर लिया है। हमारे URL-शॉर्टनिंग टूल और ${SMS_APP_NAME} का आनंद लें। क्या आपको ई-सिम कार्ड चाहिए? ${SUPPORT_HANDLE} से संपर्क करें।`
      : `आपने {{plan}} प्लान को सफलतापूर्वक सब्सक्राइब कर लिया है। हमारे URL-शॉर्टनिंग टूल और ${SMS_APP_NAME} का आनंद लें। ऐप डाउनलोड करें: ${SMS_APP_LINK}। क्या आपको ई-सिम कार्ड चाहिए? ${SUPPORT_HANDLE} से संपर्क करें।`,
  alreadySubscribedPlan: days => `आपकी सदस्यता सक्रिय है और ${days} दिनों में समाप्त होगी।`,
  payError: `भुगतान सत्र नहीं मिला। कृपया पुनः प्रयास करें या सहायता ${SUPPORT_USERNAME} से संपर्क करें। अधिक जानकारी ${TG_HANDLE} पर प्राप्त करें।`,
  chooseFreeDomainText: `<b>शानदार खबर!</b> यह डोमेन आपके सब्सक्रिप्शन के साथ मुफ्त में उपलब्ध है। क्या आप इसे दावा करना चाहेंगे?`,

  chooseDomainToBuy: text =>
    `<b>वेबसाइट का हिस्सा बनाएं!</b> कृपया वह डोमेन नाम साझा करें जिसे आप खरीदना चाहते हैं, जैसे कि "abcpay.com". ${text}`,
  askDomainToUseWithShortener: `क्या आप इस डोमेन के साथ संक्षेपण उपयोग करना चाहते हैं?`,
  blockUser: `कृपया उस उपयोगकर्ता का उपयोगकर्ता नाम साझा करें जिसे ब्लॉक करना है।`,
  unblockUser: `कृपया उस उपयोगकर्ता का उपयोगकर्ता नाम साझा करें जिसे अनब्लॉक करना है।`,
  blockedUser: `आप फिलहाल बॉट के उपयोग से अवरुद्ध हैं। कृपया सहायता से संपर्क करें ${SUPPORT_USERNAME}. ${TG_HANDLE} पर अधिक जानें।`,
  greet: `इस स्थान पर नजर रखें! हम URL संक्षेपण एप्लिकेशन को लॉन्च करने की तैयारी कर रहे हैं जो आपके लिंक को छोटा, मीठा और सीधे होगा। हमारी बड़ी प्रकटता के लिए प्रतीक्षा करें।

सहायता ${SUPPORT_USERNAME} पर Telegram में है।`,
  linkExpired: `${CHAT_BOT_BRAND} परीक्षण समाप्त हो गया है और आपका संक्षेपित लिंक निष्क्रिय हो गया है। हम URL सेवा और मुफ्त डोमेन नामों तक पहुंच बनाए रखने के लिए सब्सक्राइब करने के लिए आमंत्रित करते हैं। उपयुक्त योजना चुनें और सब्सक्राइब करने के निर्देशों का पालन करें। किसी भी प्रश्न के लिए हमें संपर्क करें।
सादर,
${CHAT_BOT_BRAND} टीम
${TG_CHANNEL} पर अधिक जानें।`,
  successPayment: `भुगतान सफलतापूर्वक संसाधित हो गया! इस विंडो को अब बंद करें।`,
  welcome: `${CHAT_BOT_NAME} को चुनने के लिए धन्यवाद! कृपया नीचे एक विकल्प चुनें :`,
  welcomeFreeTrial: `${CHAT_BOT_BRAND} में आपका स्वागत है! हमारे एक बार के नि:शुल्क परीक्षण का आनंद लें - ${FREE_LINKS} लिंक संक्षिप्त करें, ${FREE_LINKS_HOURS} घंटे के लिए सक्रिय। ${CHAT_BOT_BRAND} अंतर का अनुभव करें!`,
  unknownCommand: `कमांड नहीं मिला। /start दबाएं या सहायता ${SUPPORT_USERNAME} से संपर्क करें। ${TG_HANDLE} पर अधिक जानें।`,
  support: `कृपया सहायता से संपर्क करें ${SUPPORT_USERNAME}. ${TG_HANDLE} पर अधिक जानें।`,
  joinChannel: `कृपया चैनल ${TG_CHANNEL} में शामिल हों।`,
  dnsPropagated: `{{domain}} के लिए DNS प्रसार समाप्त हो गया है और अनलिमिटेड URL संक्षेपण के लिए उपलब्ध है।`,
  dnsNotPropagated: `{{domain}} के लिए DNS प्रसार जारी है और आपको अपडेट किया जाएगा जब यह समाप्त हो जाए। ✅`,
  domainBoughtSuccess: domain => `डोमेन ${domain} अब आपका है। धन्यवाद कि आपने हमें चुना।

सादर,
${CHAT_BOT_NAME}`,

  domainBought: `आपका डोमेन {{domain}} अब आपके खाते से जोड़ा गया है जबकि DNS प्रसार जारी है। आप जल्द ही स्थिति से स्वचालित रूप से अपडेट हो जाएंगे।🚀`,
  domainLinking: domain =>
    `डोमेन आपके खाते से लिंक कर रहे हैं। कृपया ध्यान दें कि DNS अपडेट में 30 मिनट तक का समय लग सकता है। आप यहां अपने DNS अपडेट स्थिति की जांच कर सकते हैं: https://www.whatsmydns.net/#A/${domain}`,
  errorSavingDomain: `डोमेन को सर्वर पर सहेजने में त्रुटि, समर्थन ${SUPPORT_USERNAME} से संपर्क करें। ${TG_HANDLE} पर अधिक जानें।`,
  chooseDomainToManage: `कृपया चयन करें यदि आप DNS सेटिंग्स प्रबंधित करना चाहते हैं।`,
  chooseDomainWithShortener: `कृपया वह डोमेन नाम चुनें या खरीदें जिसे आप अपने संक्षेपित लिंक से कनेक्ट करना चाहते हैं।`,
  viewDnsRecords: `यहां DNS रिकॉर्ड्स हैं {{domain}} के लिए`,
  addDns: `DNS रिकॉर्ड जोड़ें`,
  updateDns: `DNS रिकॉर्ड अपडेट करें`,
  deleteDns: `DNS रिकॉर्ड हटाएं`,
  addDnsTxt: `कृपया वह रिकॉर्ड प्रकार चुनें जिसे आप जोड़ना चाहते हैं:`,
  updateDnsTxt: `कृपया वह रिकॉर्ड आईडी टाइप करें जिसे आप अपडेट करना चाहते हैं। i.e 3`,
  deleteDnsTxt: `कृपया वह रिकॉर्ड आईडी टाइप करें जिसे आप हटाना चाहते हैं। i.e 3`,
  confirmDeleteDnsTxt: `क्या आप निश्चित हैं? हां या नहीं`,
  a: `A रिकॉर्ड`,
  cname: `CNAME रिकॉर्ड`,
  ns: `NS रिकॉर्ड`,
  'A Record': `A रिकॉर्ड`,
  'CNAME Record': `CNAME रिकॉर्ड`,
  'NS Record': `NS रिकॉर्ड`,
  askDnsContent: {
    A: `कृपया A रिकॉर्ड प्रदान करें। i.e, 108.0.56.98`,
    'A Record': `कृपया A रिकॉर्ड प्रदान करें। i.e, 108.0.56.98`,
    CNAME: `कृपया CNAME रिकॉर्ड प्रदान करें। i.e, abc.hello.org`,
    'CNAME Record': `कृपया CNAME रिकॉर्ड प्रदान करें। i.e, abc.hello.org`,
    NS: `कृपया अपना NS रिकॉर्ड दर्ज करें। i.e., dell.ns.cloudflare.com. एक नया NS रिकॉर्ड मौजूदा रिकॉर्ड में जोड़ा जाएगा।`,
    'NS Record': `कृपया अपना NS रिकॉर्ड दर्ज करें। i.e., dell.ns.cloudflare.com .यदि N1-N4 पहले से मौजूद है, तो कृपया रिकॉर्ड को अपडेट करें`,
  },
  askUpdateDnsContent: {
    A: `कृपया A रिकॉर्ड प्रदान करें। i.e, 108.0.56.98`,
    'A Record': `कृपया A रिकॉर्ड प्रदान करें। i.e, 108.0.56.98`,
    CNAME: `कृपया CNAME रिकॉर्ड प्रदान करें। i.e, abc.hello.org`,
    'CNAME Record': `कृपया CNAME रिकॉर्ड प्रदान करें। i.e, abc.hello.org`,
    NS: `चयनित आईडी के लिए नया NS रिकॉर्ड अपडेट किया जाएगा। एक नया रिकॉर्ड जोड़ने के लिए, कृपया "DNS रिकॉर्ड जोड़ें" चुनें`,
    'NS Record': `चयनित आईडी के लिए नया NS रिकॉर्ड अपडेट किया जाएगा। एक नया रिकॉर्ड जोड़ने के लिए, कृपया "DNS रिकॉर्ड जोड़ें" चुनें`,
  },
  dnsRecordSaved: `रिकॉर्ड जोड़ा गया`,
  dnsRecordDeleted: `रिकॉर्ड हटाया गया`,
  dnsRecordUpdated: `रिकॉर्ड अपडेट किया गया`,
  provideLink: `कृपया एक वैध यूआरएल प्रदान करें। उदाहरण के लिए https://google.com`,
  comingSoonWithdraw: `निकासी जल्द आ रही है। समर्थन ${SUPPORT_USERNAME} से संपर्क करें। ${TG_HANDLE} पर अधिक जानें।`,
  selectCurrencyToDeposit: `कृपया जमा करने के लिए मुद्रा चुनें`,
  depositNGN: `कृपया एनजीएन राशि दर्ज करें:`,
  askEmailForNGN: `कृपया भुगतान की पुष्टि के लिए ईमेल प्रदान करें`,
  depositUSD: `कृपया USD राशि दर्ज करें, ध्यान दें कि न्यूनतम मूल्य $6 है:`,
  selectCryptoToDeposit: `कृपया एक क्रिप्टो मुद्रा चुनें:`,
  'bank-pay-plan': (priceNGN, plan) =>
    `कृपया "भुगतान करें" पर क्लिक करके ${priceNGN} NGN भेजें। एक बार जब लेनदेन की पुष्टि हो जाती है, तो आप स्वचालित रूप से सूचित किए जाएंगे और आपका ${plan} योजना सुचारू रूप से सक्रिय हो जाएगा।

संपर्क: ${CHAT_BOT_NAME}`,
  bankPayDomain: (priceNGN, domain) =>
    `कृपया "भुगतान करें" पर क्लिक करके ${priceNGN} NGN भेजें। एक बार जब लेनदेन की पुष्टि हो जाती है, तो आप स्वचालित रूप से सूचित किए जाएंगे और आपका डोमेन ${domain} सुचारू रूप से सक्रिय हो जाएगा।

संपर्क: ${CHAT_BOT_NAME}`,
  showDepositCryptoInfoPlan: (priceCrypto, tickerView, address, plan) =>
    `कृपया ${priceCrypto} ${tickerView} को\n\n<code>${address}</code> भेजें

कृपया ध्यान दें कि क्रिप्टो लेनदेन को पूरा होने में 30 मिनट तक का समय लग सकता है। एक बार जब लेनदेन की पुष्टि हो जाती है, तो आप स्वचालित रूप से सूचित किए जाएंगे और आपका ${plan} योजना सुचारू रूप से सक्रिय हो जाएगा।

संपर्क: ${CHAT_BOT_NAME}`,
  showDepositCryptoInfoDomain: (priceCrypto, tickerView, address, domain) =>
    `कृपया ${priceCrypto} ${tickerView} को\n\n<code>${address}</code> भेजें

कृपया ध्यान दें कि क्रिप्टो लेनदेन को पूरा होने में 30 मिनट तक का समय लग सकता है। एक बार जब लेनदेन की पुष्टि हो जाती है, तो आप स्वचालित रूप से सूचित किए जाएंगे और आपका डोमेन ${domain} सुचारू रूप से सक्रिय हो जाएगा।

संपर्क: ${CHAT_BOT_NAME}`,

  showDepositCryptoInfo: (priceCrypto, tickerView, address) =>
    `कृपया ${priceCrypto} ${tickerView} भेजें\n\n<code>${address}</code>\n\nकृपया ध्यान दें, क्रिप्टो लेनदेन को पूरा होने में 30 मिनट तक का समय लग सकता है। लेन-देन की पुष्टि होने के बाद आपको तुरंत सूचना दी जाएगी और आपके वॉलेट को अपडेट किया जाएगा।\n\nसादर,\n${CHAT_BOT_NAME}`,

  confirmationDepositMoney: (amount, usd) =>
    `आपकी ${amount} ($${usd}) की राशि संसाधित हो गई है। हमें चुनने के लिए धन्यवाद।\nसादर,\n${CHAT_BOT_NAME}`,

  showWallet: (usd, ngn) => `वॉलेट शेष राशि :\n\n${bal(usd, ngn)}`,

  wallet: (usd, ngn) => `वॉलेट शेष राशि :\n\n${bal(usd, ngn)}\n\nवॉलेट विकल्प का चयन करें :`,

  walletSelectCurrency: (usd, ngn) =>
    `कृपया अपने वॉलेट बैलेंस से भुगतान के लिए मुद्रा का चयन करें :\n\n${bal(usd, ngn)}`,

  walletBalanceLow: `कृपया अपने वॉलेट को रिचार्ज करें`,

  sentLessMoney: (expected, got) =>
    `आपने अपेक्षित राशि से कम पैसा भेजा, इसलिए हम प्राप्त राशि को आपके वॉलेट में क्रेडिट कर चुके हैं। हमसे ${expected} की उम्मीद थी लेकिन हमने ${got} प्राप्त की।`,

  sentMoreMoney: (expected, got) =>
    `आपने अपेक्षित राशि से अधिक पैसा भेजा, इसलिए हमने अतिरिक्त राशि को आपके वॉलेट में क्रेडिट कर दिया। हमसे ${expected} की उम्मीद थी लेकिन हमने ${got} प्राप्त की।`,

  buyLeadsError: `दुर्भाग्यवश चयनित क्षेत्र कोड उपलब्ध नहीं है और आपका वॉलेट चार्ज नहीं किया गया है।`,
  buyLeadsProgress: (i, total) =>
    `${((i * 100) / total).toFixed()}% लीड्स डाउनलोड किए जा रहे हैं। कृपया प्रतीक्षा करें.`,

  phoneNumberLeads: `कृपया एक विकल्प चुनें`,

  buyLeadsSelectCountry: `कृपया देश का चयन करें`,
  buyLeadsSelectSmsVoice: `कृपया एसएमएस / वॉयस चुनें`,
  buyLeadsSelectArea: `कृपया क्षेत्र का चयन करें`,
  buyLeadsSelectAreaCode: `कृपया क्षेत्र कोड का चयन करें`,
  buyLeadsSelectCarrier: `कृपया ऑपरेटर का चयन करें`,
  buyLeadsSelectCnam: `क्या आप मालिक का नाम देखना चाहते हैं? CNAME प्रति 1000 लीड्स के लिए अतिरिक्त 15 डॉलर की लागत है।`,
  buyLeadsSelectAmount: (min, max) =>
    `आप कितनी लीड्स खरीदना चाहते हैं? एक संख्या चुनें या दर्ज करें। न्यूनतम ${min} और अधिकतम ${max}।`,

  buyLeadsSelectFormat: `फॉर्मेट चुनें, जैसे लोकल (212) या इंटरनेशनल (+1212)`,

  buyLeadsSuccess: n => `बधाई हो, आपकी ${n} लीड्स डाउनलोड की गई हैं।`,

  buyLeadsNewPrice: (leads, price, newPrice) => ` ${leads} लीड्स की कीमत अब $${view(newPrice)} <s>($${price})</s> है।`,
  buyLeadsPrice: (leads, price) => ` ${leads} लीड्स की कीमत $${price} है।`,

  confirmNgn: (usd, ngn) => `${usd} USD ≈ ${ngn} NGN `,

  walletSelectCurrencyConfirm: `पुष्ट करें?`,

  validatorSelectCountry: `कृपया देश का चयन करें`,
  validatorPhoneNumber: `कृपया अपने नंबर पेस्ट करें या फाइल अपलोड करें जिसमें देश का कोड शामिल हो।`,
  validatorSelectSmsVoice: n =>
    `${n} फ़ोन नंबर पाए गए हैं। कृपया एसएमएस या वॉयस कॉल लीड्स की मान्यता के लिए विकल्प चुनें।`,
  validatorSelectCarrier: `कृपया ऑपरेटर का चयन करें`,
  validatorSelectCnam: `क्या आप मालिक का नाम देखना चाहते हैं? CNAME प्रति 1000 लीड्स के लिए अतिरिक्त 15 डॉलर की लागत है।`,
  validatorSelectAmount: (min, max) =>
    `आप कितने नंबरों की मान्यता चाहते हैं? एक संख्या चुनें या दर्ज करें। न्यूनतम ${min} और अधिकतम ${max}`,

  validatorSelectFormat: `फॉर्मेट चुनें, जैसे लोकल (212) या इंटरनेशनल (+1212)`,

  validatorSuccess: (n, m) => `${n} लीड्स की मान्यता हुई। ${m} मान्य फ़ोन नंबर पाए गए हैं।`,
  validatorProgress: (i, total) =>
    `${((i * 100) / total).toFixed()}% लीड्स मान्य किए जा रहे हैं। कृपया प्रतीक्षा करें.`,
  validatorProgressFull: (i, total) => `${((i * 100) / total).toFixed()}% लीड्स मान्य किए जा रहे हैं।`,

  validatorError: `दुर्भाग्यवश चयनित फ़ोन नंबर उपलब्ध नहीं हैं और आपका वॉलेट चार्ज नहीं किया गया है।`,
  validatorErrorFileData: `अवैध देश फ़ोन नंबर पाया गया। कृपया चयनित देश के लिए फ़ोन नंबर अपलोड करें।`,
  validatorErrorNoPhonesFound: `कोई फ़ोन नंबर नहीं मिला। पुनः प्रयास करें।`,

  validatorBulkNumbersStart: `लीड्स मान्यता की शुरुआत हो गई है और जल्द ही समाप्त होगी।`,

  // url re-director
  redSelectUrl: `कृपया वह यूआरएल साझा करें जिसे आप संक्षिप्त और विश्लेषित करना चाहते हैं। उदाहरण के लिए https://cnn.com`,
  redSelectRandomCustom: `कृपया अपने चयन के लिए यादृच्छिक या कस्टम लिंक चुनें`,
  redSelectProvider: `लिंक प्रदाता चुनें`,
  redSelectCustomExt: `कस्टम पिछला भाग दर्ज करें`,

  redValidUrl: `कृपया एक मान्य यूआरएल प्रदान करें। उदाहरण के लिए https://google.com`,
  redTakeUrl: url => `आपका संक्षिप्त यूआरएल है: ${url}`,
  redIssueUrlBitly: `कोई समस्या, आपका वॉलेट चार्ज नहीं हुआ।`,
  redIssueSlugCuttly: `वांछित लिंक नाम पहले से ही लिया गया है, कृपया दूसरा प्रयास करें।`,
  redIssueUrlCuttly: `कोई समस्या`,
  redNewPrice: (price, newPrice) =>
    `कीमत अब $${view(newPrice)} <s>($${price})</s> है। कृपया भुगतान पद्धति का चयन करें।`,
  customLink: 'कस्टम लिंक',
  randomLink: 'रैंडम लिंक',
  askShortLinkExtension: 'कृपया हमें अपनी पसंदीदा शॉर्ट लिंक एक्सटेंशन बताएं: जैसे payer',
  linkAlreadyExist: `लिंक पहले से मौजूद है। कृपया 'ok' टाइप करें और दूसरा प्रयास करें।`,
  yourShortendUrl: shortUrl => `आपका शॉर्ट किया हुआ URL है: ${shortUrl}`,

  availablefreeDomain: (plan, available, s) =>
    `याद रखें, आपके ${plan} योजना में ${available} ".sbs" डोमेन फ्री शामिल हैं${s}. आज ही अपना डोमेन प्राप्त करें!`,
  shortenedUrlLink: `कृपया वह यूआरएल साझा करें जिसे आप छोटा और विश्लेषित करना चाहते हैं। ई.g https://cnn.com`,
  selectedTrialPlan: `आपने फ्री ट्रायल योजना चुनी है`,
  userPressedBtn: message => `उपयोगकर्ता ने ${message} बटन दबाया।`,
  userToBlock: userToBlock => `उपयोगकर्ता ${userToBlock} नहीं मिला।`,
  userBlocked: userToBlock => `उपयोगकर्ता ${userToBlock} को ब्लॉक कर दिया गया है।`,
  checkingDomainAvail: `डोमेन उपलब्धता की जांच की जा रही है...`,
  checkingExistingDomainAvail: `मौजूदा डोमेन की उपलब्धता की जांच की जा रही है...`,
  subscribeFirst: `📋 सबसे पहले सदस्यता लें`,
  notValidHalf: `एक वैध बैक हाफ दर्ज करें`,
  linkAlreadyExist: `लिंक पहले से मौजूद है। कृपया कोई अन्य आजमाएं।`,
  issueGettingPrice: `मूल्य प्राप्त करने में समस्या`,
  domainInvalid: `डोमेन नाम अमान्य है। कृपया कोई अन्य डोमेन नाम आजमाएं। उपयोग प्रारूप abcpay.com`,
  chooseValidPlan: `कृपया एक वैध योजना चुनें`,
  noDomainFound: `कोई डोमेन नाम नहीं मिला`,
  chooseValidDomain: `कृपया एक वैध डोमेन चुनें`,
  errorDeletingDns: error => `डीएनएस रिकॉर्ड को हटाने में त्रुटि, ${error}, कृपया फिर से मूल्य प्रदान करें`,
  selectValidOption: `सही विकल्प चुनें`,
  maxDnsRecord: `अधिकतम 4 NS रिकॉर्ड जोड़े जा सकते हैं, आप पहले के NS रिकॉर्ड को अपडेट या हटा सकते हैं`,
  errorSavingDns: error => `डीएनएस रिकॉर्ड को बचाने में त्रुटि, ${error}, कृपया फिर से मूल्य प्रदान करें`,
  fileError: `फाइल प्रोसेसिंग के दौरान त्रुटि हुई।`,
  ammountIncorrect: `राशि गलत है`,
  subscriptionExpire: (subscribedPlan, timeEnd) => `आपका ${subscribedPlan} योजना समाप्त हो गया है ${timeEnd}`,
  plansSubscripedtill: (subscribedPlan, timeEnd) =>
    `आप ${subscribedPlan} योजना में सदस्यता ले चुके हैं। आपका प्लान ${timeEnd} तक वैध है`,
  planNotSubscriped: `आप वर्तमान में किसी भी योजना के सदस्य नहीं हैं।`,
  noShortenedUrlLink: `आपके पास अभी कोई संक्लिष्ट लिंक नहीं है।`,
  shortenedLinkText: linksText => `यहां आपके संक्लिष्ट लिंक हैं:\n${linksText}`,

  qrCodeText: `यह आपका क्यूआर कोड है!`,
  scanQrOrUseChat: chatId =>
    `क्यूआर को स्कैन करें SMS मार्केटिंग ऐप के साथ लॉगिन करने के लिए। आप इस कोड का उपयोग करके भी लॉगिन कर सकते हैं: ${chatId}`,
  domainPurchasedFailed: (domain, buyDomainError) =>
    `डोमेन खरीद विफल, एक अन्य नाम का प्रयास करें। ${domain} ${buyDomainError}`,
}

const phoneNumberLeads = ['💰📲 Buy PhoneLeads', '✅📲 Validate PhoneLeads']

const buyLeadsSelectCountry = Object.keys(areasOfCountry)
const buyLeadsSelectSmsVoice = ['SMS (Price 20$ for 1000)', 'Voice (Price 0$ for 1000)']
const buyLeadsSelectArea = country => Object.keys(areasOfCountry?.[country])
const buyLeadsSelectAreaCode = (country, area) => {
  const codes = areasOfCountry?.[country]?.[area].map(c => format(countryCodeOf[country], c))
  return codes.length > 1 ? ['Mixed Area Codes'].concat(codes) : codes
}
const _buyLeadsSelectAreaCode = (country, area) => areasOfCountry?.[country]?.[area]
const buyLeadsSelectCnam = yesNo
const buyLeadsSelectCarrier = country => carriersOf[country]
const buyLeadsSelectAmount = ['1000', '2000', '3000', '4000', '5000']
const buyLeadsSelectFormat = ['Local Format', 'International Format']

const validatorSelectCountry = Object.keys(areasOfCountry)
const validatorSelectSmsVoice = ['SMS (Price 15$ for 1000)', 'Voice (Price 0$ for 1000)']
const validatorSelectCarrier = country => carriersOf[country]
const validatorSelectCnam = yesNo
const validatorSelectAmount = ['ALL', '1000', '2000', '3000', '4000', '5000']
const validatorSelectFormat = ['Local Format', 'International Format']

//redSelectRandomCustom

const redSelectRandomCustom = ['यादृच्छिक शॉर्ट लिंक']

const redSelectProvider = ['Bit.ly $10 (कोई परीक्षण नहीं)', 'Ap1s.net (परीक्षण के बाद सदस्यता आवश्यक)']

const tickerOf = {
  BTC: 'btc',
  LTC: 'ltc',
  ETH: 'eth',
  'USDT (TRC20)': 'trc20_usdt',
  BCH: 'bch',
  'USDT (ERC20)': 'erc20_usdt',
  DOGE: 'doge',
  TRON: 'trx',
  // Matic: 'polygon_matic',
}

const supportedCrypto = {
  BTC: '₿ बिटकॉइन (BTC)',
  LTC: 'Ł लाइटकॉइन (LTC)',
  DOGE: 'Ð डोजकॉइन (DOGE)',
  BCH: 'Ƀ बिटकॉइन कैश (BCH)',
  ETH: 'Ξ एथेरियम (ETH)',
  TRON: '🌐 ट्रॉन (TRX)',
  'USDT (TRC20)': '₮ टेथर (USDT - TRC20)',
  'USDT (ERC20)': '₮ टेथर (USDT - ERC20)',
}

/////////////////////////////////////////////////////////////////////////////////////
const _bc = ['वापस', 'रद्द करें']

const payIn = {
  crypto: 'क्रिप्टो',
  ...(HIDE_BANK_PAYMENT !== 'true' && { bank: 'बैंक ₦नायरा + कार्ड🏦💳' }),
  wallet: '👛 वॉलेट',
}

const tickerViews = Object.keys(tickerOf)
const reverseObject = o => Object.fromEntries(Object.entries(o).map(([key, val]) => [val, key]))
const tickerViewOf = reverseObject(tickerOf)
const supportedCryptoView = reverseObject(supportedCrypto)
const supportedCryptoViewOf = Object.keys(supportedCryptoView)

const kOf = list => ({
  reply_markup: {
    // Handle if there are multiples buttons in a row
    keyboard: [
      ...list.map(a => (Array.isArray(a) ? a : [a])),
      ...(list.some(
        a =>
          Array.isArray(a) &&
          a.some(
            item =>
              typeof item === 'string' &&
              (item.includes(t.backButton) ||
                item.includes(user.backToHostingPlans) ||
                item.includes(user.backToStarterPlanDetails) ||
                item.includes(user.backToPurchaseOptions)),
          ),
      )
        ? []
        : [_bc]),
    ],
  },
  parse_mode: 'HTML',
})
const yes_no = {
  parse_mode: 'HTML',
  reply_markup: {
    keyboard: [yesNo, _bc],
  },
  disable_web_page_preview: true,
}
const k = {
  of: kOf,

  wallet: {
    reply_markup: {
      keyboard: [[u.deposit], [u.withdraw], _bc],
    },
  },

  pay: {
    reply_markup: {
      keyboard: [Object.values(payIn), _bc],
    },
    parse_mode: 'HTML',
  },

  phoneNumberLeads: kOf(phoneNumberLeads),
  buyLeadsSelectCountry: kOf(buyLeadsSelectCountry),
  buyLeadsSelectSmsVoice: kOf(buyLeadsSelectSmsVoice),
  buyLeadsSelectArea: country => kOf(buyLeadsSelectArea(country)),
  buyLeadsSelectAreaCode: (country, area) => kOf(buyLeadsSelectAreaCode(country, area)),
  buyLeadsSelectCarrier: country => kOf(buyLeadsSelectCarrier(country)),
  buyLeadsSelectCnam: kOf(yesNo),
  buyLeadsSelectAmount: kOf(buyLeadsSelectAmount),
  buyLeadsSelectFormat: kOf(buyLeadsSelectFormat),
  // changing here for validatorSelectCountry
  validatorSelectCountry: kOf(validatorSelectCountry),
  validatorSelectSmsVoice: kOf(validatorSelectSmsVoice),
  validatorSelectCarrier: country => kOf(validatorSelectCarrier(country)),
  validatorSelectCnam: kOf(validatorSelectCnam),
  validatorSelectAmount: kOf(validatorSelectAmount),
  validatorSelectFormat: kOf(validatorSelectFormat),

  //url shortening
  redSelectRandomCustom: kOf(redSelectRandomCustom),

  redSelectProvider: kOf(redSelectProvider),
}
const payOpts = HIDE_BANK_PAYMENT !== 'true' ? k.of([u.usd, u.ngn]) : k.of([u.usd])

const adminKeyboard = {
  reply_markup: {
    keyboard: Object.values(admin).map(b => [b]),
  },
}

const userKeyboard = {
  reply_markup: {
    keyboard: [
      [user.cPanelWebHostingPlans],
      [user.pleskWebHostingPlans],
      [user.joinChannel, user.wallet],
      [user.phoneNumberLeads],
      HIDE_SMS_APP === 'true' ? [user.domainNames] : [user.freeTrialAvailable, user.domainNames],
      [user.urlShortenerMain],
      [user.buyPlan, user.viewPlan],
      HIDE_BECOME_RESELLER === 'true'
        ? [user.changeSetting, user.getSupport]
        : [user.changeSetting, user.becomeReseller, user.getSupport],
    ],
  },
  parse_mode: 'HTML',
  disable_web_page_preview: true,
}

const languages = {
  en: '🇬🇧 अंग्रेज़ी',
  fr: '🇫🇷 फ़्रेंच',
  zh: '🇨🇳 चीनी',
  hi: '🇮🇳 हिंदी',
}
const supportedLanguages = reverseObject(languages)

const languageMenu = {
  reply_markup: {
    keyboard: [[languages.en], [languages.fr], [languages.zh], [languages.hi]],
  },
  parse_mode: 'HTML',
  disable_web_page_preview: true,
}

const l = {
  askPreferredLanguage: `🌍 सुनिश्चित करें कि सब कुछ आपकी वरीय भाषा में है, नीचे एक का चयन करें:
  
आप हमेशा बाद में अपनी भाषा सेटिंग्स में बदल सकते हैं।`,
  askValidLanguage: 'कृपया एक मान्य भाषा का चयन करें:',
  welcomeMessage: `👋 ${CHAT_BOT_NAME} में आपका स्वागत है!
हम आपको यहाँ पाकर बहुत खुश हैं! 🎉
चलिए शुरू करते हैं ताकि आप हमारी सभी रोमांचक विशेषताओं का अनुभव कर सकें। 🌟

इस सेटअप को जल्दी और आसानी से पूरा करें—आओ कूदते हैं! 🚀`,
  askUserEmail: 'आपका ईमेल क्या है? हमें आपकी व्यक्तिगत अनुभव को अनुकूलित करने दें! (उदाहरण: davidsen@gmail.com)',
  processUserEmail: `धन्यवाद 😊 हम आपके खाते को अब सेट कर रहे हैं।
कृपया कुछ क्षण प्रतीक्षा करें जब हम विवरण को अंतिम रूप दे रहे हैं। ⏳
 
हम बैकएंड में काम कर रहे हैं। बस कदमों का पालन करें!`,
  confirmUserEmail: `✨ बड़ी खबर! आपका खाता तैयार है! 🎉💃🎉

फ्री ट्रायल अवधि के दौरान प्रीमियम विशेषताओं का आनंद लें!`,
  termsAndCond: `📜 आगे बढ़ने से पहले, कृपया हमारे शर्तें और नीतियाँ समीक्षा और स्वीकृत करें।`,
  acceptTermMsg: `कृपया ${CHAT_BOT_NAME} का उपयोग जारी रखने के लिए शर्तें और नीतियों को स्वीकृत करें।`,
  acceptTermButton: '✅ स्वीकृत करें',
  declineTermButton: '❌ अस्वीकार करें',
  viewTermsAgainButton: '🔄 पुनः देखें शर्तें',
  exitSetupButton: '❌ सेटअप छोड़ें',
  acceptedTermsMsg: `✅ आपने सफलतापूर्वक शर्तें और नीतियाँ स्वीकार की हैं! 🎉
आप ${CHAT_BOT_NAME} का उपयोग शुरू करने के लिए तैयार हैं। चलिए मज़ेदार हिस्से में चलते हैं! 🎯

आप अपने प्रोफ़ाइल सेटिंग्स में शर्तें और नीतियाँ कभी भी पुनः देख सकते हैं।`,
  declinedTermsMsg: `⚠️ आपको ${CHAT_BOT_NAME} का उपयोग जारी रखने के लिए शर्तें और नीतियाँ स्वीकार करनी होंगी। 
जब आप तैयार हों, तो उन्हें पुनः समीक्षा करें।`,
  userExitMsg: 'उपयोगकर्ता ने निकास बटन दबाया।',
  termsAndCondMsg: `<h1>${CHAT_BOT_NAME} उपयोग की शर्तें</h1>
        <p><strong>प्रभावी तिथि:</strong> 01/01/2022</p>
        <p>${CHAT_BOT_NAME} का उपयोग करने का अर्थ है कि आप इन उपयोग की शर्तों को स्वीकार करते हैं।</p>

        <h2>1. शर्तों की स्वीकृति</h2>
        <p>आपकी उम्र 18 वर्ष या उससे अधिक होनी चाहिए, या आपके पास अभिभावक की सहमति होनी चाहिए, और आपको इन शर्तों और हमारी गोपनीयता नीति से सहमत होना होगा।</p>

        <h2>2. प्रदान की जाने वाली सेवाएँ</h2>
        <p>हम डोमेन पंजीकरण, वेब होस्टिंग, और साइट/एप्लिकेशन सेटअप सहायता प्रदान करते हैं।</p>

        <h2>3. उपयोगकर्ता की जिम्मेदारियाँ</h2>
        <p>सटीक जानकारी प्रदान करें, अवैध गतिविधियों से बचें, और अपने Telegram खाते को सुरक्षित रखें।</p>

        <h2>4. भुगतान की शर्तें</h2>
        <p>सभी भुगतान अंतिम हैं जब तक कि अन्यथा उल्लेख न किया गया हो। भुगतान न करने पर सेवाएं निलंबित की जा सकती हैं।</p>

        <h2>5. सेवाओं की सीमाएँ</h2>
        <p>हम संसाधन सीमाएँ लगा सकते हैं या रखरखाव या तकनीकी समस्याओं के कारण सेवा में व्यवधान हो सकता है।</p>

        <h2>6. समाप्ति</h2>
        <p>उल्लंघन या भुगतान न करने की स्थिति में हम सेवाएँ समाप्त कर सकते हैं। उपयोगकर्ता किसी भी समय रद्द कर सकते हैं, लेकिन शुल्क वापस नहीं किया जाएगा।</p>

        <h2>7. जिम्मेदारी</h2>
        <p>सेवाएँ "जैसी हैं" के आधार पर प्रदान की जाती हैं। हम डेटा हानि, व्यवधान, या उपयोगकर्ता सुरक्षा उल्लंघनों के लिए उत्तरदायी नहीं हैं।</p>

        <h2>8. गोपनीयता</h2>
        <p>हम आपके डेटा को हमारी गोपनीयता नीति के अनुसार प्रबंधित करते हैं और केवल कानूनी आवश्यकताओं के अनुसार साझा करते हैं।</p>

        <h2>9. शर्तों में बदलाव</h2>
        <p>हम इन शर्तों को अपडेट कर सकते हैं, और निरंतर उपयोग का मतलब है कि आप इसे स्वीकार करते हैं।</p>

        <h2>10. संपर्क करें</h2>
        <p>सहायता के लिए, कृपया <a href="${APP_SUPPORT_LINK}" target="_blank">${APP_SUPPORT_LINK}</a> पर संपर्क करें।</p>

        <p>${CHAT_BOT_NAME} का उपयोग करने का अर्थ है कि आप इन शर्तों से सहमत हैं। धन्यवाद!</p>`,
}

const termsAndConditionType = lang => ({
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'नियम और शर्तें देखें',
          web_app: {
            url: `${SELF_URL}/terms-condition?lang=${lang}`,
          },
        },
      ],
    ],
  },
})

const planOptions = ['दैनिक', 'साप्ताहिक', 'मासिक']
const planOptionsOf = {
  दैनिक: 'Daily',
  साप्ताहिक: 'Weekly',
  मासिक: 'Monthly',
}

const linkOptions = [t.randomLink, t.customLink]

const chooseSubscription = {
  parse_mode: 'HTML',
  reply_markup: {
    keyboard: [...planOptions.map(a => [a]), _bc],
  },
}

const dO = {
  reply_markup: {
    keyboard: [_bc, ['Backup Data'], ['Restore Data']],
  },
}

const bc = {
  parse_mode: 'HTML',
  reply_markup: {
    keyboard: [_bc],
  },
  disable_web_page_preview: true,
}

const dns = {
  parse_mode: 'HTML',
  reply_markup: {
    keyboard: [[t.addDns], [t.updateDns], [t.deleteDns], _bc],
  },
  disable_web_page_preview: true,
}
const dnsRecordType = {
  parse_mode: 'HTML',
  reply_markup: {
    keyboard: [[t.cname], [t.ns], [t.a], _bc],
  },
  disable_web_page_preview: true,
}

const linkType = {
  reply_markup: {
    keyboard: [linkOptions, _bc],
  },
}

const show = domains => ({
  reply_markup: {
    keyboard: [[user.buyDomainName], ...domains.map(d => [d]), _bc],
  },
})

const payBank = url => ({
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'भुगतान करें',
          web_app: {
            url,
          },
        },
      ],
    ],
  },
})

const html = (text = t.successPayment) => {
  return `
        <html>
            <body>
                <p style="font-family: 'system-ui';" >${text}</p>
            </body>
        </html>
    `
}

const plans = hostingType => {
  return {
    starterPlan: {
      name: 'स्टार्टर प्लान',
      price: HOSTING_STARTER_PLAN_PRICE,
      duration: '30 दिन',
      storage: '10 जीबी SSD',
      bandwidth: '100 जीबी',
      domains: '1 डोमेन',
      emailAccounts: '5 ईमेल खाते',
      databases: '1 MySQL डेटाबेस',
      features: `${hostingType} का पूर्ण एक्सेस फाइलें, डेटाबेस, ईमेल आदि प्रबंधित करने के लिए।`,
      idealFor: 'पर्सनल ब्लॉग्स, छोटे व्यवसाय की वेबसाइट्स, या पोर्टफोलियो।',
    },
    proPlan: {
      name: 'प्रो प्लान',
      price: HOSTING_PRO_PLAN_PRICE,
      duration: '30 दिन',
      storage: '50 जीबी SSD',
      bandwidth: '500 जीबी',
      domains: '5 डोमेन्स',
      emailAccounts: '25 ईमेल खाते',
      databases: '10 MySQL डेटाबेस',
      features: `${hostingType} का पूर्ण एक्सेस बैकअप्स, सुरक्षा, और विश्लेषण के लिए उन्नत उपकरणों के साथ।`,
      additionalFeatures: 'मुफ़्त वेबसाइट माइग्रेशन, दैनिक बैकअप्स।',
      idealFor: 'छोटे से मध्यम व्यवसाय की वेबसाइट्स, ई-कॉमर्स साइट्स।',
    },
    businessPlan: {
      name: 'बिजनेस प्लान',
      price: HOSTING_BUSINESS_PLAN_PRICE,
      duration: '30 दिन',
      storage: '100 जीबी SSD',
      bandwidth: 'अनलिमिटेड',
      domains: 'अनलिमिटेड डोमेन्स',
      emailAccounts: 'अनलिमिटेड ईमेल खाते',
      databases: 'अनलिमिटेड MySQL डेटाबेस',
      features: `${hostingType} का पूर्ण एक्सेस सभी उन्नत सुविधाओं और प्राथमिकता समर्थन के साथ।`,
      additionalFeatures: 'मुफ़्त वेबसाइट माइग्रेशन, दैनिक बैकअप्स, स्टेजिंग एनवायरनमेंट, उन्नत सुरक्षा सुविधाएं।',
      idealFor: 'बड़े व्यवसाय, उच्च ट्रैफ़िक वेबसाइट्स, और अधिक लचीलापन चाहने वाले डेवलपर्स।',
    },
  }
}

const hostingPlansText = {
  plans: plans,

  generatePlanText: (hostingType, planKey) => {
    const plan = plans(hostingType)[planKey]
    return `
    🚀 <b>${plan.name}: $${plan.price}</b>
    
    <b>- अवधि:</b> ${plan.duration}
    <b>- स्टोरेज:</b> ${plan.storage}
    <b>- बैंडविड्थ:</b> ${plan.bandwidth}
    <b>- डोमेन्स:</b> ${plan.domains}
    <b>- ईमेल खाते:</b> ${plan.emailAccounts}
    <b>- डेटाबेस:</b> ${plan.databases}
    <b>- मुफ्त SSL:</b> हां
    <b>- ${hostingType} की विशेषताएं:</b> ${plan.features}
    ${plan.additionalFeatures ? `<b>- अतिरिक्त सुविधाएं:</b> ${plan.additionalFeatures}` : ''}
    <b>- उपयुक्त के लिए:</b> ${plan.idealFor}`
  },
  generatePlanStepText: step => {
    const commonSteps = {
      buyText: 'शानदार चयन! क्या आप एक नया डोमेन चाहते हैं या मौजूदा का उपयोग करना चाहते हैं?',
      registerNewDomainText: 'कृपया वह डोमेन नाम दर्ज करें जिसे आप पंजीकृत करना चाहते हैं (जैसे, example.com)।',
      domainNotFound:
        'आपके द्वारा दर्ज किया गया डोमेन नहीं मिला। कृपया सुनिश्चित करें कि यह सही है या कोई और कोशिश करें।',
      useExistingDomainText: 'कृपया अपना मौजूदा डोमेन नाम दर्ज करें (जैसे, example.com)।',
      useExistingDomainNotFound:
        'आपके द्वारा दर्ज किया गया डोमेन आपके खाते से संबद्ध नहीं है। कृपया जांचें या समर्थन से संपर्क करें।',
      enterYourEmail: 'कृपया अपना ईमेल पता प्रदान करें ताकि हम आपका खाता बना सकें और रसीद भेज सकें।',
      invalidEmail: 'कृपया एक वैध ईमेल प्रदान करें।',
      paymentConfirmation: 'कृपया अपना खरीदारी जारी रखने के लिए लेनदेन की पुष्टि करें।',
      paymentSuccess: `हम आपके भुगतान की पुष्टि कर रहे हैं। जैसे ही यह पुष्टि होगी, आपको सूचित किया जाएगा। धन्यवाद!`,
      paymentFailed: 'भुगतान असफल। कृपया पुनः प्रयास करें।',
    }

    return `${commonSteps[step]}`
  },

  generateDomainFoundText: (websiteName, price) => `डोमेन ${websiteName} उपलब्ध है! इसकी लागत $${price} है।`,
  generateExistingDomainText: websiteName => `आपने ${websiteName} को अपने डोमेन के रूप में चुना है।`,
  domainNotFound: websiteName => `डोमेन ${websiteName} उपलब्ध नहीं है।`,
  nameserverSelectionText: websiteName =>
    `कृपया ${websiteName} के लिए आप जिस नेमसर्वर प्रदाता का उपयोग करना चाहते हैं, उसे चुनें।`,
  confirmEmailBeforeProceeding: email => `क्या आप वाकई इस ईमेल ${email} के साथ जारी रखना चाहते हैं?`,

  generateInvoiceText: payload => `
<b>डोमेन पंजीकरण</b>
<b>- डोमेन: </b> ${payload.domainName}
<b>- मूल्य: </b> $${payload?.existingDomain ? '0 (मौजूदा डोमेन का उपयोग)' : payload.domainPrice}
  
<b>वेब होस्टिंग</b>
<b>- अवधि: </b> 1 माह
<b>- मूल्य: </b> $${payload.hostingPrice}
  
<b>कुल देय राशि:</b>
<b>- कूपन छूट: </b> $${payload.couponDiscount}
<b>- USD: </b> $${payload?.couponApplied ? payload.newPrice : payload.totalPrice}
<b>- कर: </b> $0.00
  
<b>भुगतान की शर्तें</b>
यह एक अग्रिम भुगतान चालान है। कृपया सुनिश्चित करें कि भुगतान 1 घंटे के भीतर पूरा हो ताकि आपका डोमेन और होस्टिंग सेवाएं सक्रिय हो सकें। भुगतान प्राप्त होने के बाद, हम आपकी सेवा को सक्रिय करेंगे।
`,

  showCryptoPaymentInfo: (priceCrypto, tickerView, address, plan) => `
कृपया ${priceCrypto} ${tickerView} को निम्नलिखित पते पर भेजें:
  
<code>${address}</code>
  
कृपया ध्यान दें कि क्रिप्टो लेनदेन को पूरा होने में 30 मिनट तक का समय लग सकता है। जैसे ही लेनदेन की पुष्टि होगी, आपको तुरंत सूचित किया जाएगा और आपका ${plan} सक्रिय कर दिया जाएगा।
  
सादर,
${CHAT_BOT_NAME}`,

  successText: (info, response) =>
    `यहां आपके ${info.hostingType} क्रेडेंशियल्स हैं ${info.plan} के लिए :

डोमेन : ${info.website_name}
यूज़रनेम : ${response.username}
ईमेल : ${info.email}
पासवर्ड : ${response.password}
यूआरएल : ${response.url}

<b>नामसर्वर</b>
- ${response.nameservers.ns1}
- ${response.nameservers.ns2}
  
आपके ${info.hostingType} क्रेडेंशियल्स को आपके ईमेल ${info.email} पर सफलतापूर्वक भेज दिया गया है।`,

  support: (plan, statusCode) => `किसी तकनीकी समस्या का सामना हुआ है ${plan} के साथ | ${statusCode}. 
                                              कृपया ${SUPPORT_USERNAME} से संपर्क करें।
                                              अधिक जानकारी के लिए ${TG_HANDLE}.`,

  bankPayDomain: (
    priceNGN,
    plan,
  ) => `कृपया ${priceNGN} NGN का भुगतान करें और “भुगतान करें” पर क्लिक करें। एक बार लेनदेन की पुष्टि हो जाने पर, आपको तुरंत सूचित कर दिया जाएगा और आपका ${plan} बिना किसी परेशानी के सक्रिय कर दिया जाएगा।

सादर,
${CHAT_BOT_NAME}`,
}

const hi = {
  k,
  t,
  u,
  dO,
  bc,
  npl,
  dns,
  kOf,
  user,
  show,
  yesNo,
  html,
  payIn,
  admin,
  payOpts,
  yes_no,
  payBank,
  alcazar,
  planOptionsOf,
  tickerOf,
  linkType,
  tickerViews,
  linkOptions,
  planOptions,
  tickerViewOf,
  dnsRecordType,
  o: userKeyboard,
  phoneNumberLeads,
  aO: adminKeyboard,
  chooseSubscription,
  buyLeadsSelectArea,
  buyLeadsSelectCnam,
  buyLeadsSelectAmount,
  buyLeadsSelectFormat,
  buyLeadsSelectCountry,
  buyLeadsSelectCarrier,
  buyLeadsSelectSmsVoice,
  buyLeadsSelectAreaCode,
  _buyLeadsSelectAreaCode,
  validatorSelectCountry,
  validatorSelectSmsVoice,
  validatorSelectCarrier,
  validatorSelectCnam,
  validatorSelectAmount,
  validatorSelectFormat,
  redSelectRandomCustom,
  redSelectProvider,
  supportedCrypto,
  supportedCryptoView,
  supportedCryptoViewOf,
  languageMenu,
  supportedLanguages,
  l,
  termsAndConditionType,
  hp: hostingPlansText,
}

module.exports = {
  hi,
}
