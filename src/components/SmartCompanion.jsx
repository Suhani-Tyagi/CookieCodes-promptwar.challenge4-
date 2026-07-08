import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Languages, 
  AlertCircle, 
  Trash2,
  HelpCircle,
  Clock,
  CheckCircle,
  FileText,
  Compass,
  ShieldAlert
} from 'lucide-react';

// Pre-baked high-quality responses for Simulated Mode across FIFA languages
const simulatedResponses = {
  en: {
    parking: "🅿️ **Stadium Parking & Ingress Rules:**\n\n1. **Reservations**: All vehicles require a pre-booked parking pass (available on the FIFA portal). No drive-up parking is permitted.\n2. **Accessible Lots**: Lot E and Lot F are reserved for fans with valid state/national ADA placards. High-frequency shuttles connect these lots to Gate C.\n3. **Rideshare**: The designated rideshare drop-off and pick-up zone is located at **Lot K** (15-minute walk from Gate D).\n\nDo you want me to look up walking directions from Lot K?",
    wheelchair: "♿ **Wheelchair & Accessibility Guide:**\n\n1. **Ingress**: All main gates (Gates A, B, C, D) have accessible, step-free lanes with ramp access.\n2. **Ramps & Elevators**: Ramps 3B and 5A provide direct access to the Upper Tier. Elevators are located at Concourse Sector 2 (near Gate B) and Sector 6 (near Gate D).\n3. **Sensory Rooms**: A quiet/sensory room is located in Section 112 (Level 1 Concourse) for fans needing a calm space.\n4. **Assistive Listening**: Receivers can be checked out free of charge at any Guest Services Booth (Sectors 102, 118, 204).",
    shuttle: "🚌 **Matchday Transit & Shuttle Services:**\n\n1. **Metro Connection**: The Express Metro Station is located directly opposite Gate A. Trains run every 4 minutes before and after the match.\n2. **Park-and-Ride Shuttles**: Direct shuttles run continuously to the North Lot (Lot N) and South Lot (Lot S). \n3. **Rideshare**: Pick up at Lot K. Please note ride-sharing wait times are currently averaging 12-15 minutes.",
    prohibited: "🚫 **Prohibited Items Policy (FIFA Stadium Security):**\n\n- **Bags**: Clear plastic bags smaller than 12\"x6\"x12\" are allowed. Large backpacks and opaque bags are strictly prohibited.\n- **Cameras**: Small consumer cameras (lens under 3 inches) are permitted. Professional telephoto lenses, tripods, and monopods are forbidden.\n- **Aerosols**: Hair sprays, aerosol deodorants, and flares are banned.\n- **Outside Food/Beverages**: Not permitted, except for infants or medically documented diets. Reusable empty water containers are allowed.",
    sustainability: "🌱 **Green Stadium & Sustainability Rewards:**\n\n1. **Eco-Points**: Earn points by disposing of beverage cups at any Smart Recycling Bin.\n2. **Rewards**: 400 pts = Free fountain soda at Concessions; 500 pts = 10% discount coupon at the FIFA Fan Shop.\n3. **Reusable Cup Return**: Each cup returned to a beverage vendor refunds $1 USD or awards +50 Eco-Points.",
    default: "I am your ArenaAssist FIFA Stadium Companion. I can provide gate directions, shuttle schedules, accessibility resources, prohibited items checklists, and sustainability reward rules. Feel free to ask about any stadium operations topic!"
  },
  es: {
    parking: "🅿️ **Reglas de Estacionamiento y Acceso:**\n\n1. **Reservas**: Todos los vehículos requieren un pase de estacionamiento adquirido previamente (no se permite pago en sitio).\n2. **Lotes Accesibles**: Los Lotes E y F están reservados para personas con discapacidad (ADA). Hay transbordadores gratuitos directos hacia el Acceso C.\n3. **Vehículos Compartidos**: La zona de recogida y descarga está en el **Lote K**.",
    wheelchair: "♿ **Guía de Accesibilidad:**\n\n1. **Entradas**: Todos los accesos principales tienen rampas sin escalones.\n2. **Ascensores**: Ubicados en los Sectores 2 (cerca del Acceso B) y 6 (cerca del Acceso D).\n3. **Salas Sensoriales**: Ubicadas en la Sección 112 para fanáticos que necesiten un espacio tranquilo.",
    shuttle: "🚌 **Servicios de Transporte:**\n\n1. **Metro**: La estación está frente al Acceso A. Trenes cada 4 minutos.\n2. **Lanzaderas**: Conectan continuamente con los Lotes Norte (Lote N) y Sur (Lote S).\n3. **Uber/Didi**: Punto de encuentro en el Lote K.",
    prohibited: "🚫 **Objetos Prohibidos:**\n\n- **Bolsos**: Solo bolsos de plástico transparentes de menos de 30x15x30 cm.\n- **Cámaras**: Cámaras pequeñas permitidas. Lentes profesionales prohibidos.\n- **Comida Exterior**: No permitida, salvo comida de bebé o dietas médicas.",
    sustainability: "🌱 **Recompensas Ecológicas:**\n\n1. **Eco-Puntos**: Deseche vasos en contenedores inteligentes para ganar puntos.\n2. **Canje**: 400 pts = Bebida gratis; 500 pts = 10% de descuento en la Tienda Oficial.",
    default: "Soy su asistente ArenaAssist. Puedo guiarlo sobre estacionamientos, accesos, transporte, reglas de seguridad y recompensas ecológicas en su idioma natal."
  },
  fr: {
    parking: "🅿️ **Règles de Stationnement & Ingress :**\n\n1. **Réservations** : Un pass pré-acheté est obligatoire pour accéder aux parkings.\n2. **Parking Accessible** : Les parkings E et F sont réservés aux personnes à mobilité réduite (PMR). Navettes gratuites vers la Porte C.\n3. **Covoiturage/Taxis** : Zone de dépose au parking K.",
    wheelchair: "♿ **Guide d'Accessibilité PMR :**\n\n1. **Entrées** : Toutes les entrées principales ont des voies sans marche.\n2. **Ascenseurs** : Secteurs 2 (près de la Porte B) et 6 (près de la Porte D).\n3. **Salles Sensorielles** : Section 112 pour un espace de calme.",
    shuttle: "🚌 **Transports Matchday :**\n\n1. **Métro Express** : Station en face de la Porte A. Rames toutes les 4 minutes.\n2. **Navettes Park-and-Ride** : Navettes en continu vers les parkings N (Nord) et S (Sud).\n3. **Taxis** : Prise en charge au parking K.",
    prohibited: "🚫 **Objets Interdits au Stade :**\n\n- **Sacs** : Sacs plastiques transparents autorisés (< 30x15x30 cm).\n- **Appareils Photo** : Objectifs professionnels, trépieds et monopodes interdits.\n- **Nourriture** : Nourriture extérieure interdite (sauf bébés).",
    sustainability: "🌱 **Récompenses Éco-Responsables :**\n\n1. **Éco-Points** : Recyclez vos gobelets aux bacs connectés.\n2. **Récompenses** : 400 pts = Boisson gratuite ; 500 pts = -10% en boutique.",
    default: "Je suis votre compagnon ArenaAssist. Je peux vous guider pour les parkings, l'accessibilité, le recyclage et les transports."
  },
  pt: {
    parking: "🅿️ **Regras de Estacionamento e Acesso:**\n\n1. **Reservas**: Necessário reservar passe de estacionamento online.\n2. **PCD**: Lotes E e F reservados para portadores de necessidades especiais. Navetes para o Portão C.\n3. **Uber/Táxi**: Ponto de encontro no Lote K.",
    wheelchair: "♿ **Guia de Acessibilidade:**\n\n1. **Acesso**: Rampas sem degraus em todas as entradas principais.\n2. **Elevadores**: Setores 2 (perto do Portão B) e 6 (perto do Portão D).\n3. **Sala Sensorial**: Localizada na Seção 112.",
    shuttle: "🚌 **Transporte Coletivo:**\n\n1. **Metrô**: Estação em frente ao Portão A. Trens a cada 4 minutos.\n2. **Ônibus Circular**: Conexão com os Lotes Norte (Lote N) e Sul (Lote S).\n3. **Aplicativos**: Embarque no Lote K.",
    prohibited: "🚫 **Itens Proibidos (Segurança FIFA):**\n\n- **Bolsas**: Apenas bolsas plásticas transparentes de até 30x15x30 cm.\n- **Câmeras**: Lentes profissionais e tripés são estritamente proibidos.\n- **Alimentos**: Proibida a entrada de comida externa (exceto bebês).",
    sustainability: "🌱 **Recompensas Sustentáveis:**\n\n1. **Eco-Pontos**: Ganhe pontos descartando copos nos Coletores Inteligentes.\n2. **Prêmios**: 400 pts = Refrigerante grátis; 500 pts = 10% de desconto na loja.",
    default: "Sou o ArenaAssist. Posso orientar sobre estacionamento, acessibilidade PCD, ônibus e regras de segurança."
  },
  ar: {
    parking: "🅿️ **تعليمات مواقف السيارات الدخول:**\n\n1. **الحجز المسبق**: يجب حجز تذاكر المواقف مسبقاً عبر الإنترنت. لا توجد مبيعات في الموقع.\n2. **مواقف ذوي الاحتياجات الخاصة**: الموقفين E و F مخصصين لأصحاب الهمم، مع توفر حافلات مجانية للبوابة C.\n3. **سيارات الأجرة**: منطقة الركوب والتنزيل المخصصة تقع في الموقف K.",
    wheelchair: "♿ **دليل ذوي الاحتياجات الخاصة وسهولة الوصول:**\n\n1. **المداخل**: جميع البوابات الرئيسية تحتوي على مسارات خالية من العتبات.\n2. **المصاعد**: متوفرة في القسمين 2 (قرب البوابة B) و 6 (قرب البوابة D).\n3. **الغرف الحسية**: تقع في القسم 112 لتوفير بيئة هادئة للمشجعين.",
    shuttle: "🚌 **حافلات النقل ووسائل المواصلات:**\n\n1. **المترو**: محطة المترو السريع تقع أمام البوابة A مباشرة، وتعمل كل 4 دقائق.\n2. **حافلات المواقف**: تنقل مستمر للمواقف الشمالية (Lote N) والمواقف الجنوبية (Lote S).\n3. **سيارات الأجرة**: نقطة التجمع في الموقف K.",
    prohibited: "🚫 **قائمة المواد المحظورة في الملعب:**\n\n- **الحقائب**: يسمح بالحقائب البلاستيكية الشفافة التي لا تتعدى 30x15x30 سم.\n- **الكاميرات**: تمنع الكاميرات والعدسات الاحترافية وحواملها.\n- **المأكولات**: يمنع إدخال الأطعمة والمشروبات الخارجية (باستثناء أطعمة الأطفال).",
    sustainability: "🌱 **مكافآت الاستدامة والملعب الأخضر:**\n\n1. **النقاط البيئية**: احصل على نقاط عند إلقاء الأكواب في حاويات التدوير الذكية.\n2. **الجوائز**: 400 نقطة = مشروب مجاني؛ 500 نقطة = 10% خصم في متجر فيفا.",
    default: "مرحباً بك، أنا مساعد الملعب الذكي ArenaAssist. يمكنني مساعدتك في العثور على المواقف، حافلات النقل، سهولة الوصول، والمواد المحظورة."
  },
  hi: {
    parking: "🅿️ **स्टेडियम पार्किंग और प्रवेश नियम:**\n\n1. **आरक्षण**: सभी वाहनों के लिए फीफा पोर्टल पर पार्किंग पास पहले से बुक करना अनिवार्य है।\n2. **सुलभ पार्किंग**: लॉट E और लॉट F दिव्यांग प्रशंसकों (ADA) के लिए आरक्षित हैं। यहाँ से गेट C के लिए शटल सेवा उपलब्ध है।\n3. **राइडशेयर**: राइडशेयर पिक-अप और ड्रॉप-ऑफ जोन **लॉट K** में स्थित है (गेट D से 15 मिनट की पैदल दूरी)।",
    wheelchair: "♿ **दिव्यांगता एवं सुगमता गाइड:**\n\n1. **प्रवेश**: सभी मुख्य द्वारों (गेट A, B, C, D) पर रैंप सुलभता उपलब्ध है।\n2. **लिफ्ट और एलिवेटर**: ऊपरी स्तरों पर जाने के लिए लिफ्ट सेक्टर 2 (गेट B के पास) और सेक्टर 6 (गेट D के पास) पर उपलब्ध हैं।\n3. **सेंसरी रूम**: शांत वातावरण के लिए सेक्शन 112 (लेवल 1 कॉनकोर्स) में सेंसरी रूम उपलब्ध है।",
    shuttle: "🚌 **मैचडे ट्रांजिट और शटल सेवाएं:**\n\n1. **मेट्रो**: एक्सप्रेस मेट्रो स्टेशन गेट A के ठीक सामने है। हर 4 मिनट में मेट्रो उपलब्ध है।\n2. **पार्क-एंड-राइड शटल**: नॉर्थ लॉट (लॉट N) और साउथ लॉट (लॉट S) के लिए शटल बसें लगातार चलती हैं।\n3. **राइडशेयर**: पिक-अप लॉट K पर होता है।",
    prohibited: "🚫 **प्रतिबंधित वस्तुओं की नीति (फीफा सुरक्षा):**\n\n- **बैग**: 12\"x6\"x12\" से छोटे पारदर्शी प्लास्टिक बैग की अनुमति है। बड़े बैग और बैकपैक प्रतिबंधित हैं।\n- **कैमरा**: व्यावसायिक लेंस, ट्राइपॉड और मोनोपॉड वर्जित हैं।\n- **बाहरी भोजन**: अनुमति नहीं है, केवल शिशुओं या चिकित्सा आहार के मामलों को छोड़कर।",
    sustainability: "🌱 **ग्रीन स्टेडियम और इको-पॉइंट्स पुरस्कार:**\n\n1. **इको-पॉइंट्स**: कपों को रीसाइक्लिंग बिन में डालकर अंक अर्जित करें।\n2. **पुरस्कार**: 400 अंक = निःशुल्क पेय; 500 अंक = फीफा स्टोर पर 10% की छूट।",
    default: "मैं आपका एरीनाअसिस्ट स्टेडियम सहायक हूँ। मैं पार्किंग, शटल बस समय सारिणी, सुलभता गाइड और रीसाइक्लिंग नियमों के बारे में आपकी सहायता कर सकता हूँ।"
  }
};

export default function SmartCompanion() {
  const { chatHistory, setChatHistory, settings, language, userProfile, t } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('chat'); // 'chat' or 'simplifier'

  // Chat sessions state
  const [chatSessions, setChatSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('fifa_chat_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [activeSessionId, setActiveSessionId] = useState(() => {
    return localStorage.getItem('fifa_active_session_id') || '';
  });

  // Sync sessions to localStorage
  useEffect(() => {
    localStorage.setItem('fifa_chat_sessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  useEffect(() => {
    if (activeSessionId) {
      localStorage.setItem('fifa_active_session_id', activeSessionId);
    } else {
      localStorage.removeItem('fifa_active_session_id');
    }
  }, [activeSessionId]);

  // Load active session on mount
  useEffect(() => {
    if (activeSessionId) {
      const session = chatSessions.find(s => s.id === activeSessionId);
      if (session) {
        setChatHistory(session.messages);
      }
    } else if (chatSessions.length > 0) {
      setActiveSessionId(chatSessions[0].id);
      setChatHistory(chatSessions[0].messages);
    }
  }, []);

  // Sync active chatHistory back to the active session in chatSessions
  useEffect(() => {
    if (chatHistory.length === 0) return;
    if (chatHistory.length === 1 && chatHistory[0].sender === 'ai' && chatHistory[0].text.includes('Hello!')) {
      return;
    }

    setChatSessions(prev => {
      const activeId = activeSessionId || 'session-' + Date.now();
      if (!activeSessionId) {
        setActiveSessionId(activeId);
      }

      const exists = prev.some(s => s.id === activeId);
      if (exists) {
        return prev.map(s => {
          if (s.id === activeId) {
            let title = s.title;
            if (title === 'Untitled Chat' || title === 'New Chat' || title === 'Untitled Session') {
              const firstUserMsg = chatHistory.find(m => m.sender === 'user');
              if (firstUserMsg) {
                title = firstUserMsg.text.length > 30 ? firstUserMsg.text.substring(0, 27) + '...' : firstUserMsg.text;
              }
            }
            return { ...s, messages: chatHistory, title };
          }
          return s;
        });
      } else {
        let title = 'Untitled Chat';
        const firstUserMsg = chatHistory.find(m => m.sender === 'user');
        if (firstUserMsg) {
          title = firstUserMsg.text.length > 30 ? firstUserMsg.text.substring(0, 27) + '...' : firstUserMsg.text;
        }
        return [
          {
            id: activeId,
            title,
            messages: chatHistory,
            timestamp: new Date().toLocaleDateString()
          },
          ...prev
        ];
      }
    });
  }, [chatHistory, activeSessionId]);

  const handleStartNewChat = () => {
    const newId = 'session-' + Date.now();
    setActiveSessionId(newId);
    setChatHistory([
      {
        sender: 'ai',
        text: "Hello! I am your ArenaAssist FIFA Stadium Companion for the FIFA World Cup 2026. Ask me questions about stadium gates, accessibility, transit shuttles, rules, or report issues. How can I help you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleClearActiveChat = () => {
    setChatHistory([
      {
        sender: 'ai',
        text: "Hello! I am your ArenaAssist FIFA Stadium Companion for the FIFA World Cup 2026. Ask me questions about stadium gates, accessibility, transit shuttles, rules, or report issues. How can I help you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    if (activeSessionId) {
      setChatSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            title: 'New Chat',
            messages: [
              {
                sender: 'ai',
                text: "Hello! I am your ArenaAssist FIFA Stadium Companion for the FIFA World Cup 2026. Ask me questions about stadium gates, accessibility, transit shuttles, rules, or report issues. How can I help you today?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]
          };
        }
        return s;
      }));
    }
  };

  const handleLoadSession = (sessionId) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSessionId(sessionId);
      setChatHistory(session.messages);
    }
  };

  const handleDeleteSession = (sessionId) => {
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      const remaining = chatSessions.filter(s => s.id !== sessionId);
      if (remaining.length > 0) {
        setActiveSessionId(remaining[0].id);
        setChatHistory(remaining[0].messages);
      } else {
        handleStartNewChat();
      }
    }
  };

  const handleClearAllSessions = () => {
    setChatSessions([]);
    localStorage.removeItem('fifa_chat_sessions');
    localStorage.removeItem('fifa_active_session_id');
    handleStartNewChat();
  };

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Simplifier states
  const [policyText, setPolicyText] = useState('');
  const [simplifiedResult, setSimplifiedResult] = useState(null);
  const [simplifying, setSimplifying] = useState(false);

  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const quickChips = [
    { text: "Stadium parking rules", keyword: "parking" },
    { text: "Wheelchair accessibility guides", keyword: "wheelchair" },
    { text: "Bus/Metro shuttles schedules", keyword: "shuttle" },
    { text: "Prohibited items bag list", keyword: "prohibited" },
    { text: "Eco-points cup rewards", keyword: "sustainability" }
  ];

  // Voice dictation simulation
  const simulateVoiceInput = () => {
    if (listening) return;
    setListening(true);
    setErrorMsg('');
    
    // Select an input query depending on language
    const voiceTexts = {
      en: "Where is the shuttle pickup for Lot K and what items are banned?",
      es: "¿Dónde está la parada de autobús del Lote K y qué está prohibido?",
      fr: "Où se trouve l'arrêt de navette du parking K et quels sont les objets interdits?",
      pt: "Onde fica o ponto do ônibus circular do Lote K e o que é proibido?",
      ar: "أين تقع حافلات النقل للموقف K وما هي المواد الممنوعة؟",
      hi: "लॉट K के लिए शटल बस कहाँ से मिलेगी और क्या-क्या चीजें प्रतिबंधित हैं?"
    };

    const targetText = voiceTexts[language] || voiceTexts['en'];

    // Simulated typing from speech
    let currentIdx = 0;
    setInputValue('');
    
    const interval = setInterval(() => {
      setInputValue(prev => prev + targetText.charAt(currentIdx));
      currentIdx++;
      if (currentIdx >= targetText.length) {
        clearInterval(interval);
        setListening(false);
      }
    }, 40);
  };

  const getSimulatedResponse = (userText) => {
    const lowerText = userText.toLowerCase();
    const langDict = simulatedResponses[language] || simulatedResponses['en'];
    
    if (lowerText.includes('parking') || lowerText.includes('estacionamiento') || lowerText.includes('stationnement') || lowerText.includes('موقف') || lowerText.includes('पार्किंग')) {
      return langDict.parking;
    } else if (lowerText.includes('wheelchair') || lowerText.includes('discapacidad') || lowerText.includes('pmr') || lowerText.includes('الهمم') || lowerText.includes('व्हीलचेयर') || lowerText.includes('accessibility')) {
      return langDict.wheelchair;
    } else if (lowerText.includes('shuttle') || lowerText.includes('lanzadera') || lowerText.includes('navette') || lowerText.includes('حافلة') || lowerText.includes('शटल') || lowerText.includes('metro') || lowerText.includes('transit')) {
      return langDict.shuttle;
    } else if (lowerText.includes('prohibited') || lowerText.includes('banned') || lowerText.includes('prohibido') || lowerText.includes('interdit') || lowerText.includes('محظور') || lowerText.includes('प्रतिबंधित') || lowerText.includes('bag')) {
      return langDict.prohibited;
    } else if (lowerText.includes('sustainability') || lowerText.includes('eco') || lowerText.includes('recycle') || lowerText.includes('points') || lowerText.includes('cup') || lowerText.includes('हरा')) {
      return langDict.sustainability;
    } else {
      return langDict.default;
    }
  };

  const getSimulatedPolicySimplification = () => {
    return `### 📋 Stadium Regulations Summary (Simplified)
Official FIFA Fan Safety and Stadium Entry Policy.

#### 1. Core Rule
All fans must pass security checkpoints using a clear bag policy and a verified match ticket. Outside food and beverages are forbidden.

#### 2. Allowed vs Prohibited Items
* ✅ **Allowed**: Clear plastic bags (< 12"x6"x12"), empty reusable water bottles, small umbrellas, phones, consumer cameras (lens < 3 inches).
* ❌ **Prohibited**: Opaque backpacks, professional camera tripods/telephoto lenses, selfie sticks, aerosol spray bottles, flares/fireworks, horns/vuvuzelas.

#### 3. Entry Steps
1. Arrive at least **2 hours before kickoff** to clear security checkpoints.
2. Separate metal items (keys, phones) before passing through turnstiles.
3. Keep digital tickets ready on your phone with maximum screen brightness.`;
  };

  const getGeminiResponse = async (userText) => {
    if (settings.apiMode === 'live') {
      if (!settings.geminiApiKey) {
        const fallbackText = getSimulatedResponse(userText);
        return `ℹ️ [Simulated Fallback Mode - No Gemini API Key provided. Enter your key in Settings to activate Live Gemini Engine]\n\n${fallbackText}`;
      }
      try {
        const genAI = new GoogleGenerativeAI(settings.geminiApiKey);
        // Use gemini-1.5-flash as the standard model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Inject system instructions for the stadium operations agent based on active role
        const prompt = `You are "ArenaAssist", an advanced GenAI stadium operations assistant and multilingual fan liaison for the FIFA World Cup 2026.
You are running at MetLife Stadium, NY/NJ.
Selected language: ${language}.
Respond in the language of the user query.
Format answers in structured bullet points. Give specific, clear guidance regarding gates, transit, security, and sustainability.

Current User Profile:
- Name: ${userProfile.name}
- Active Role: ${userProfile.role}
- Assigned Seat: ${userProfile.seatNumber}
- Ticket Category: ${userProfile.ticketCategory}
- Eco Points Balance: ${userProfile.ecoPoints}

Adapt your tone and operational details to their Active Role:
- If Fan: Focus on seating location, concessions, gates, transit shuttles, and recycling points.
- If Volunteer: Focus on supervisor commands, helping fans find sections, Turnstile Gate operations, and shifts.
- If Venue Staff: Focus on incident reporting, maintenance dispatch, emergency codes, and safety checks.
- If Organizer: Act as a high-level command center liaison supplying gate flow rates, incident queue statuses, and dispatching protocols.

User Query: ${userText}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (err) {
        console.error("Gemini API Error:", err);
        const fallbackText = getSimulatedResponse(userText);
        return `⚠️ [Gemini API Error: ${err.message || "Failed to contact API"}. Switched to local simulated fallback]\n\n${fallbackText}`;
      }
    } else {
      // Simulated response lookup
      return new Promise((resolve) => {
        setTimeout(() => {
          const simulatedText = getSimulatedResponse(userText);
          resolve(simulatedText + `\n\n[Processed via Simulated ${userProfile.role} Operations Engine]`);
        }, 1200); // 1.2s realistic loading delay
      });
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    setErrorMsg('');
    // User message
    const userMsg = {
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      const responseText = await getGeminiResponse(text);
      
      const aiMsg = {
        sender: "ai",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (err) {
      setErrorMsg(err.message || "Failed to generate response.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSimplifyPolicy = async () => {
    if (!policyText.trim()) return;
    setSimplifying(true);
    setErrorMsg('');
    setSimplifiedResult(null);

    if (settings.apiMode === 'live') {
      if (!settings.geminiApiKey) {
        const fallbackText = getSimulatedPolicySimplification();
        setSimplifiedResult({
          text: `ℹ️ [Simulated Fallback Mode - No Gemini API Key. Switched to offline analyzer]\n\n${fallbackText}`,
          engine: "Simulated Fallback Engine"
        });
        setSimplifying(false);
        return;
      }
      try {
        const genAI = new GoogleGenerativeAI(settings.geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are a regulations simplifier for FIFA World Cup 2026. Parse this complex policy text and generate a structured summary including:
1. "Core Rule" (A single sentence description)
2. "Allowed vs Prohibited Items" (Compare in lists)
3. "Immediate Action Items" (Numbered list of steps the fan needs to take).
Respond in the matching language of the policy or ${language}.
Regulations Text: ${policyText}`;

        const result = await model.generateContent(prompt);
        const text = await result.response.text();
        
        setSimplifiedResult({
          text,
          engine: "Gemini 1.5 Flash"
        });
      } catch (err) {
        console.error(err);
        const fallbackText = getSimulatedPolicySimplification();
        setSimplifiedResult({
          text: `⚠️ [Gemini API Error: ${err.message || "Failed to simplify circular"}. Switched to offline analyzer]\n\n${fallbackText}`,
          engine: "Simulated Fallback Engine"
        });
      } finally {
        setSimplifying(false);
      }
    } else {
      // Simulated policy simplifier
      setTimeout(() => {
        setSimplifiedResult({
          text: getSimulatedPolicySimplification(),
          engine: "Simulated Policy Simplifier"
        });
        setSimplifying(false);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Mode Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">{t('navCompanion')}</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            GenAI assistance for matchday logistics, accessibility routing, and policy translation.
          </p>
        </div>

        {/* Engine status indicator */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">Engine Mode:</span>
          <span className={`px-2 py-0.5 rounded-full font-semibold flex items-center gap-1.5 ${
            settings.apiMode === 'live' 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-450' 
              : 'bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${settings.apiMode === 'live' ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
            {settings.apiMode === 'live' ? 'Gemini Live' : 'Simulated AI'}
          </span>
        </div>
      </div>

      {/* Subtab selection: Chat or Policy Simplifier */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveSubTab('chat')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
            activeSubTab === 'chat'
              ? 'border-emerald-500 text-emerald-650 dark:text-emerald-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          💬 AI Matchday Liaison
        </button>
        <button
          onClick={() => setActiveSubTab('simplifier')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
            activeSubTab === 'simplifier'
              ? 'border-emerald-500 text-emerald-650 dark:text-emerald-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          📜 {t('simplifierTitle')}
        </button>
      </div>

      {/* Subtab: Chat Window */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Main Chat Box (lg:col-span-3) */}
          <div className="lg:col-span-3 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col h-[550px] shadow-sm relative overflow-hidden">
            
            {/* Top brand border strip */}
            <div className="fifa-strip shrink-0"></div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-extrabold text-xs">
                  🤖
                </div>
                <div>
                  <h3 className="font-extrabold text-xs text-zinc-850 dark:text-zinc-200 leading-none">ArenaAssist AI</h3>
                  <span className="text-[9px] text-zinc-500 dark:text-zinc-400">Matchday Concierge</span>
                </div>
              </div>

              {/* Reset button */}
              <button
                onClick={handleClearActiveChat}
                className="text-[10px] text-zinc-400 hover:text-rose-500 font-semibold transition-colors flex items-center gap-1"
                title="Reset Chat history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Chat</span>
              </button>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((msg, index) => {
                const isAI = msg.sender === 'ai';
                return (
                  <div key={index} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                    <div className={`flex gap-2.5 max-w-[85%] ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
                      
                      {/* Avatar */}
                      <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                        isAI 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-450 border border-emerald-200/55 dark:border-emerald-800/35' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200/55 dark:border-blue-800/35'
                      }`}>
                        {isAI ? 'AA' : userProfile.name[0]}
                      </div>

                      {/* Msg Box */}
                      <div className={`p-3.5 rounded-2xl text-xs space-y-2 border shadow-sm leading-relaxed ${
                        isAI 
                          ? 'bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-200/60 dark:border-zinc-800/60 text-zinc-850 dark:text-zinc-250 rounded-tl-none' 
                          : 'bg-emerald-600 border-emerald-500 text-white rounded-tr-none'
                      }`}>
                        <div className="whitespace-pre-line font-medium">{msg.text}</div>
                        <span className={`text-[9px] block text-right ${isAI ? 'text-zinc-450 dark:text-zinc-500' : 'text-emerald-100'}`}>
                          {msg.timestamp}
                        </span>
                      </div>

                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2.5 items-center">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-450 flex items-center justify-center text-xs font-bold">
                      AA
                    </div>
                    <div className="px-4 py-2.5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-200/60 dark:border-zinc-800/60 text-xs text-zinc-500 flex items-center gap-1.5 rounded-tl-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-450 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-450 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-450 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Error alerts */}
            {errorMsg && (
              <div className="px-4 py-2 bg-rose-50 dark:bg-rose-950/20 border-t border-rose-100 dark:border-rose-900/40 text-rose-800 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Input Form */}
            <div className="p-3.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 bg-white dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-xl px-3 py-1 focus-within:ring-1 focus-within:ring-emerald-500 transition-all"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Ask ArenaAssist (${userProfile.role} view)...`}
                  className="flex-1 text-xs focus:outline-none bg-transparent border-transparent py-2 text-zinc-900 dark:text-zinc-150"
                  disabled={isTyping || listening}
                />
                
                {/* Voice Sim Button */}
                <button
                  type="button"
                  onClick={simulateVoiceInput}
                  className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                    listening 
                      ? 'bg-red-50 text-red-650 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800 animate-pulse' 
                      : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-850'
                  }`}
                  title={listening ? t('voiceListening') : t('voiceSimulate')}
                >
                  {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping || listening}
                  className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="flex items-center justify-between text-[9px] text-zinc-450 dark:text-zinc-500 mt-2 px-1">
                <span>System instruction customized to role: <strong>{userProfile.role}</strong></span>
                <span>Type in Spanish, French, Arabic or Hindi for automatic localization.</span>
              </div>
            </div>

          </div>

          {/* Chat Sessions Sidebar (lg:col-span-1) */}
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-900 pb-3">
              <h3 className="font-extrabold text-xs text-zinc-850 dark:text-zinc-250 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Saved Chat History</span>
              </h3>
              <button
                onClick={handleStartNewChat}
                className="text-[10px] text-emerald-600 dark:text-emerald-450 hover:underline font-semibold"
              >
                + New Chat
              </button>
            </div>

            {/* Session Links */}
            <div className="space-y-1 max-h-56 overflow-y-auto">
              {chatSessions.length === 0 ? (
                <p className="text-[10px] text-zinc-400 text-center py-6">No previous chats</p>
              ) : (
                chatSessions.map((session) => {
                  const isActive = session.id === activeSessionId;
                  return (
                    <div 
                      key={session.id}
                      className={`group flex items-center justify-between p-2 rounded-lg text-xs transition-all border ${
                        isActive 
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/30' 
                          : 'border-transparent text-zinc-650 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      <button
                        onClick={() => handleLoadSession(session.id)}
                        className="flex-1 text-left truncate font-medium mr-2"
                      >
                        {session.title || "Untitled Session"}
                      </button>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-rose-500 p-0.5 rounded transition-all"
                        title="Delete chat session"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {chatSessions.length > 0 && (
              <button
                onClick={handleClearAllSessions}
                className="w-full text-center text-[10px] text-rose-500 font-semibold border border-rose-200/30 hover:bg-rose-50 dark:hover:bg-rose-950/25 rounded-lg py-2 transition-all mt-2"
              >
                Clear History Feed
              </button>
            )}

            {/* Quick Chips */}
            <div className="pt-2 border-t border-zinc-150 dark:border-zinc-900 space-y-2">
              <span className="text-[10px] text-zinc-450 dark:text-zinc-500 uppercase font-semibold">Quick Stadium Queries</span>
              <div className="flex flex-wrap gap-1.5">
                {quickChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip.text)}
                    className="text-[10px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-850 px-2 py-1 rounded-full text-zinc-600 dark:text-zinc-400 transition-colors"
                  >
                    {chip.text}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Subtab: Rules Simplifier */}
      {activeSubTab === 'simplifier' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Rules Paste Section */}
          <div className="lg:col-span-1 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm border-b border-zinc-100 dark:border-zinc-900 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>Regulations Analyzer</span>
            </h3>

            <div className="space-y-3">
              <p className="text-xs text-zinc-500 leading-relaxed">
                Paste long stadium legal notices, ticketing policies, or prohibited lists below. ArenaAssist GenAI will extract Allowed/Banned objects and timeline instructions instantly.
              </p>
              
              <textarea
                value={policyText}
                onChange={(e) => setPolicyText(e.target.value)}
                placeholder="Paste rules here (e.g. 'FIFA World Cup 2026 Ticket Terms: Section 4.2 outlines bag sizes...')"
                className="w-full h-44 p-3 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-850 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-900 dark:text-zinc-100"
              />

              <button
                onClick={handleSimplifyPolicy}
                disabled={!policyText.trim() || simplifying}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-xs shadow transition-colors disabled:opacity-50"
              >
                {simplifying ? "Analyzing Regulations..." : t('simplifyBtn')}
              </button>
            </div>
          </div>

          {/* Results Output Section */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm min-h-[300px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-900 pb-3 mb-4">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Simplified Output</span>
                </h3>

                {simplifiedResult && (
                  <span className="text-[10px] bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 px-2 py-0.5 rounded font-medium">
                    Engine: {simplifiedResult.engine}
                  </span>
                )}
              </div>

              {!simplifiedResult ? (
                <div className="text-center py-16 space-y-2 text-zinc-400">
                  <Compass className="w-8 h-8 mx-auto opacity-40 text-emerald-500" />
                  <p className="text-xs">No analysis performed yet. Paste rules in the left panel to begin.</p>
                </div>
              ) : (
                <div className="text-xs leading-relaxed space-y-4 max-h-[360px] overflow-y-auto px-1 py-1">
                  <div className="whitespace-pre-line text-zinc-800 dark:text-zinc-200 font-medium">
                    {simplifiedResult.text}
                  </div>
                </div>
              )}
            </div>

            {simplifiedResult && (
              <div className="pt-4 border-t border-zinc-150 dark:border-zinc-900 flex justify-between items-center text-[10px] text-zinc-450 dark:text-zinc-500">
                <span>Analysis verified by GenAI Stadium Logistics Engine.</span>
                <button
                  onClick={() => {
                    setPolicyText('');
                    setSimplifiedResult(null);
                  }}
                  className="text-rose-500 font-bold hover:underline"
                >
                  Clear Results
                </button>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
