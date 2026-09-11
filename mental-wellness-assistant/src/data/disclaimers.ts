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
  companionNotRealAI: {
    fa: "این بخش یک هوش مصنوعی گفتگوی واقعی نیست. این اپ اصلاً به هیچ مدل زبانی زنده‌ای وصل نیست؛ فقط چیزهایی را که خودتان دربارهٔ خودتان اینجا نوشته‌اید به خاطر می‌سپارد و بر اساس حال‌وهوایی که ثبت می‌کنید، از یک فهرست از‌پیش‌نوشته‌شده، پاسخ‌های گرم و پیشنهاد مناسب انتخاب می‌کند — نه این‌که واقعاً حرف‌های شما را «بفهمد». برای همراهی واقعی و عمیق، دوستان و خانوادهٔ واقعی‌تان جایگزین‌ناپذیرند؛ و اگر حالتان واقعاً بد است، بخش‌های غربالگری سلامت روان و کمک فوری همین اپ (نه این صفحه) طراحی شده‌اند که کمک واقعی‌تری نشان دهند.",
    en: "This section is not a real conversational AI. This app isn't connected to any live language model at all — it only remembers what you've typed about yourself here, and picks a warm reply and a suggestion from a small pre-written list based on the mood you log, rather than actually understanding what you say. For real, deep companionship, real friends and family are irreplaceable; and if you're genuinely struggling, this app's mental-health screening and crisis-help sections (not this screen) are built to point you toward real help.",
  },
  quitCoachMedicalSupervision: {
    fa: "⚠️ نکتهٔ پزشکی مهم: ترک ناگهانی یا بدون نظارت الکل یا برخی مواد مخدر (به‌خصوص بعد از مصرف طولانی‌مدت یا سنگین) می‌تواند از نظر پزشکی خطرناک باشد و در موارد شدید حتی تشنج یا عوارض تهدیدکنندهٔ زندگی ایجاد کند. این بخش فقط راهنمای عمومی و انگیزشی برای ترک تدریجی سیگار یا عادت‌های رفتاری است و به‌هیچ‌وجه جایگزین سم‌زدایی پزشکی یا نظارت پزشک نمی‌شود. اگر مصرف الکل یا مواد مخدر شما سنگین، طولانی‌مدت یا همراه با علائم ترک (لرزش، تعریق، تشنج، توهم) است، پیش از هر اقدامی حتماً با پزشک یا مرکز ترک اعتیاد دارای مجوز مشورت کنید.",
    en: "⚠️ Important medical note: stopping alcohol or certain drugs suddenly or without supervision (especially after heavy or long-term use) can be medically dangerous, and in severe cases can cause seizures or life-threatening complications. This section is only general, motivational guidance for gradually reducing smoking or behavioral habits — it is not a substitute for medical detox or physician supervision. If your alcohol or drug use is heavy, long-term, or comes with withdrawal symptoms (shaking, sweating, seizures, hallucinations), please consult a physician or a licensed addiction-treatment center before doing anything else.",
  },
  careerCoachLimitations: {
    fa: "این بخش یک کارشناس استخدام یا مشاور شغلی واقعی نیست و نمی‌تواند رزومهٔ شما را واقعاً بنویسد، برای شما در سایت‌های کاریابی واقعی جستجو کند، یا وضعیت واقعی درخواست‌هایتان را پیگیری کند — این اپ اصلاً به اینترنت یا هیچ سرویس کاریابی وصل نیست. تشخیص روحیهٔ «کارمندی» یا «کارآفرینی» فقط از روی چند پاسخ ساده و از‌پیش‌تعیین‌شده است، نه یک ارزیابی روان‌شناختی واقعی. «دنبال‌کردن تا موفقیت نهایی» به این معناست که یک چک‌لیست و دفترچهٔ یادداشت روی همین گوشی نگه‌داشته می‌شود که خودتان علامت می‌زنید — نه یک سیستم واقعی یادآوری یا پیگیری خودکار. برای رزومه‌نویسی، مصاحبه، یا برنامه‌ریزی کسب‌وکار واقعی، از یک مشاور شغلی یا منتور با تجربهٔ واقعی کمک بگیرید.",
    en: "This section is not a real recruiter or career counselor — it cannot actually write your resume for you, search real job boards, or track the real status of your applications; this app has no internet or job-board connection at all. \"Employee vs. entrepreneur\" mindset is inferred from a few simple, pre-defined answers, not a real psychological assessment. \"Following you until success\" means a checklist and journal kept on this phone that you check off yourself — not a real reminder or automatic tracking system. For real resume help, interview prep, or business planning, seek out an experienced career counselor or mentor.",
  },
  songIdLimitations: {
    fa: "این بخش هیچ فناوری واقعی تشخیص صدا یا اثرانگشت صوتی (audio fingerprinting) ندارد — نمی‌تواند به زمزمهٔ شما یا کلیپ صوتی پخش‌شده گوش بدهد و آهنگ را تشخیص بدهد، دقیقاً مثل اپ‌های واقعی تشخیص موسیقی. کاری که واقعاً انجام می‌دهد: نام آهنگ، نام خواننده، یا چند کلمه‌ای که به‌خاطر دارید را (با صدا یا تایپ) با نام آهنگ‌های کاتالوگ ساختگی همین اپ (نه اینترنت یا هیچ آرشیو واقعی) به‌صورت تقریبی مطابقت می‌دهد. تمام آهنگ‌ها و «لیریکس»های نمایش‌داده‌شده کاملاً ساختگی و اورجینال هستند و به هیچ آهنگ یا ترانه‌سرای واقعی تعلق ندارند (برای پرهیز از نقض حق مالکیت معنوی). برای تشخیص واقعی آهنگ از روی صدا یا نمایش لیریکس واقعی، باید یک سرویس دارای مجوز (مثل ACRCloud یا AudD برای تشخیص صدا، Musixmatch یا Genius برای لیریکس) پشت همین بخش وصل شود — که در این اسکلت پیاده‌سازی نشده است.",
    en: "This section has no real audio-recognition or audio-fingerprinting technology — it cannot listen to your humming or a played audio clip and identify the song, unlike real music-ID apps. What it actually does: it takes the song title, artist name, or a few remembered words (spoken or typed) and does an approximate text match against this app's own fictional catalog only — never the internet or any real archive. Every track and \"lyric\" shown is entirely fictional and original, belonging to no real song or songwriter (to avoid infringing real intellectual property). For real audio-based song identification or real lyrics, a licensed provider (e.g. ACRCloud or AudD for audio recognition, Musixmatch or Genius for lyrics) would need to be wired in behind this section — not implemented in this scaffold.",
  },
  socialAdvisorLimitations: {
    fa: "این بخش هیچ‌کس دیگری را واقعاً نمی‌شناسد و شخصیت واقعی هیچ فردی را تحلیل نمی‌کند — فقط بر اساس ویژگی‌هایی که خودتان دربارهٔ طرف مقابل انتخاب می‌کنید (مثلاً «دست‌ودل‌باز» یا «کنترل‌گر») چند راهکار کلی و از‌پیش‌نوشته‌شده پیشنهاد می‌دهد. این یک ارزیابی روان‌شناختی واقعی از آن فرد نیست، فقط برداشت شخصی خود شماست. هر رابطه‌ای پیچیدگی‌های خودش را دارد؛ اگر موقعیتتان شامل کنترل شدید، تهدید یا آسیب عاطفی/جسمی است، این بخش کافی نیست — به بخش «مشاورهٔ زناشویی و روابط» یا کمک حرفه‌ای مراجعه کنید.",
    en: "This section doesn't actually know anyone and doesn't analyze any real person's personality — it only offers a few general, pre-written strategies based on traits you yourself pick for the other person (e.g. \"generous\" or \"controlling\"). This is not a real psychological assessment of that person, only your own impression. Every relationship has its own complexity; if your situation involves severe control, threats, or emotional/physical harm, this section isn't enough — see the marriage/relationship counseling section or seek professional help.",
  },
} as const;
