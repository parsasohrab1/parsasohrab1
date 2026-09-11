/**
 * Centralized disclaimer strings. Any screen that shows a screening score,
 * a supplement tip, or a crisis response MUST render the matching string
 * from here — do not paraphrase inline, so a single place controls the
 * legal/clinical framing of the whole app.
 */
export const DISCLAIMERS = {
  screeningResult: {
    fa: "این یک ابزار خودارزیابی غیرتشخیصی است، نه یک آزمون بالینی رسمی. درصدهای نشان‌داده‌شده صرفاً «شاخص احتمال» هستند و جایگزین ارزیابی روان‌پزشک یا روان‌شناس بالینی نمی‌شوند. برای تشخیص قطعی حتماً به متخصص مراجعه کنید.",
    en: "This is a non-diagnostic self-report tool, not a formal clinical exam. The percentages shown are only a rough likelihood indicator and do not replace assessment by a licensed psychiatrist or clinical psychologist. Please consult a professional for an actual diagnosis.",
  },
  supplement: {
    fa: "این موارد توصیه‌های عمومی سبک زندگی هستند، نه نسخه پزشکی. پیش از مصرف هر مکمل یا تغییر دارو، حتماً با پزشک یا داروساز خود مشورت کنید.",
    en: "These are general lifestyle suggestions, not a medical prescription. Consult your physician or pharmacist before taking any supplement or changing medication.",
  },
  crisisNotSubstitute: {
    fa: "این دستیار جایگزین کمک اورژانسی نیست. اگر خودتان یا فرد دیگری در خطر فوری هستید، همین حالا با اورژانس یا خط بحران تماس بگیرید.",
    en: "This assistant is not a substitute for emergency help. If you or someone else is in immediate danger, contact emergency services or a crisis line right now.",
  },
  neuroMotorReferral: {
    fa: "علائم حرکتی/عصبی مثل لرزش، کندی حرکت یا سفتی عضلات (مانند آنچه در بیماری پارکینسون دیده می‌شود) نیازمند معاینه فیزیکی توسط متخصص مغز و اعصاب هستند و از طریق پرسش‌وپاسخ صوتی قابل غربالگری نیستند. لطفاً در اسرع وقت به پزشک مراجعه کنید.",
    en: "Motor/neurological symptoms such as tremor, slowed movement, or muscle rigidity (as seen in Parkinson's disease) require an in-person exam by a neurologist and cannot be screened through voice Q&A. Please see a physician promptly.",
  },
  general: {
    fa: "این برنامه یک اسکلت (scaffold) نمایشی با داده‌های ساختگی (synthetic) است و برای استفاده بالینی واقعی طراحی نشده است.",
    en: "This app is a demo scaffold using synthetic data and is not designed for real clinical use.",
  },
  counselingNotSubstitute: {
    fa: "این راهکارها پیشنهادهای عمومی و آموزشی‌اند، برگرفته از رویکردهای شناخته‌شدهٔ روان‌شناسی و ضرب‌المثل‌های فارسی، نه یک جلسهٔ مشاورهٔ واقعی. برای مشکلات جدی یا پابرجا، حتماً نزد یک مشاور خانواده یا روان‌شناس بالینی دارای مجوز بروید.",
    en: "These are general, educational suggestions drawn from well-known psychological approaches and Persian proverbs — not a real counseling session. For serious or ongoing issues, please see a licensed family/couples counselor or clinical psychologist.",
  },
  relationshipSafetyNotSubstitute: {
    fa: "اگر رابطه‌تان شامل تهدید، کنترل شدید یا خشونت است، این دستیار جایگزین کمک حرفه‌ای یا حقوقی نیست. لطفاً با یک مشاور دارای مجوز، مرکز حمایت از زنان یا خانواده، یا در خطر فوری، با اورژانس تماس بگیرید.",
    en: "If your relationship involves threats, severe control, or violence, this assistant cannot replace professional or legal help. Please reach out to a licensed counselor, a domestic-violence/family support service, or emergency services if you're in immediate danger.",
  },
  fitnessNotSubstitute: {
    fa: "شاخص تودهٔ بدنی (BMI) فقط یک شاخص کلی و تقریبی است؛ میزان عضله، تراکم استخوان یا شرایط پزشکی خاص را در نظر نمی‌گیرد و به‌خصوص برای ورزشکاران عضلانی می‌تواند گمراه‌کننده باشد. توصیه‌های تغذیه و ورزش اینجا کلی و آموزشی‌اند، نه یک برنامهٔ غذایی یا تمرینی اختصاصی. پیش از هر تغییر جدی در وزن، تغذیه یا فعالیت بدنی — به‌خصوص اگر بیماری زمینه‌ای، بارداری یا سابقهٔ اختلال خوردن دارید — با پزشک، متخصص تغذیه، یا مربی ورزشی دارای مجوز مشورت کنید.",
    en: "Body Mass Index (BMI) is only a rough general indicator — it doesn't account for muscle mass, bone density, or specific medical conditions, and can be especially misleading for muscular athletes. The nutrition and exercise suggestions here are general and educational, not a personalized meal or training plan. Before any major change to your weight, diet, or physical activity — especially if you have an underlying condition, are pregnant, or have a history of an eating disorder — consult a physician, registered dietitian, or certified trainer.",
  },
  activeListeningLimitations: {
    fa: "«گوش فعال» فقط وقتی این صفحه باز و در پیش‌زمینهٔ گوشی است کار می‌کند — نه در پس‌زمینه و نه وقتی گوشی قفل است. این قابلیت صدای دعوا، آتش یا فریاد را به‌صورت صوتی تشخیص نمی‌دهد؛ فقط جمله‌هایی را که واضح گفته شوند و درست به متن تبدیل شوند، برای عبارات کلیدی بررسی می‌کند و می‌تواند دچار خطا یا تشخیص اشتباه شود. این اپ هرگز خودش و بدون اجازه با اورژانس تماس نمی‌گیرد یا پیامک نمی‌فرستد؛ همیشه فقط برنامهٔ تماس یا پیامک گوشی را با شماره و متن آماده باز می‌کند و تأیید نهایی و لمس صفحه با شماست. در خطر واقعی، همیشه مستقیم و بدون فوت وقت با ۱۱۰ (پلیس)، ۱۲۵ (آتش‌نشانی) یا ۱۱۵ (اورژانس) تماس بگیرید — به این قابلیت متکی نباشید.",
    en: "\"Active listening\" only works while this screen is open and in the foreground — never in the background or while the phone is locked. It does not acoustically detect the sound of a fight, fire, or screaming; it only scans clearly spoken, correctly transcribed sentences for keyword matches, and can misfire or miss things. This app never calls emergency services or sends a text on its own — it only opens your phone's own call or SMS app with the number and message prefilled, and the final tap is always yours. In a real emergency, always call 110 (police), 125 (fire), or 115 (ambulance) directly without delay — never rely on this feature instead.",
  },
  styleAdvisorLimitations: {
    fa: "این بخش هیچ هوش مصنوعی واقعی برای تولید یا ویرایش تصویر ندارد — نمی‌تواند عکسی از چهرهٔ واقعی شما با آرایش پیشنهادی بسازد یا خودکار داخل عکس لباس‌هایتان را تشخیص دهد. پیشنهادها فقط توضیح نوشتاری/صوتی از یک فهرست محدود و از‌پیش‌آماده‌شده هستند، و تطبیق لباس بر اساس برچسب‌هایی است که خودتان روی عکس‌ها می‌زنید، نه تحلیل تصویری واقعی. همهٔ عکس‌ها فقط روی خود گوشی شما ذخیره می‌شوند و به هیچ سروری ارسال نمی‌شوند (این اپ اصلاً بک‌اندی ندارد). آرایش و پوشش یک انتخاب کاملاً شخصی است؛ این پیشنهادها فقط برای الهام‌گرفتن‌اند، نه یک قانون یا استاندارد؛ می‌توانید هر بخشی را که دوست ندارید نادیده بگیرید. برای مشاورهٔ واقعی و اختصاصی، به یک آرایشگر یا استایلیست حرفه‌ای مراجعه کنید.",
    en: "This section has no real image-generation or image-editing AI — it cannot produce a photo of your actual face with the suggested makeup applied, or automatically recognize clothing in a photo. Suggestions are only a written/spoken description from a small pre-written list, and outfit matching works off tags you add to your own photos yourself, not real image analysis. All photos are stored only on your own phone and never sent to any server (this app has no backend at all). Makeup and clothing are entirely personal choices; these suggestions are just for inspiration, not a rule or standard — feel free to ignore any part you don't like. For real, personalized advice, see a professional makeup artist or stylist.",
  },
} as const;
