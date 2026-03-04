import { ref, computed } from 'vue'

const currentLanguage = ref(localStorage.getItem('userLanguage') || 'es')

const translations = {
    es: {
        settings: {
            title: 'Configuración',
            subtitle: 'Astral',
            welcome: 'Ajustes del Sistema',
            syncBtn: 'Sincronizar ADN',
            language: 'Idioma del Sistema',
            langEs: 'Español',
            langEn: 'Inglés',
            notifFreq: 'Frecuencia de Notificaciones',
            daily: 'Diaria',
            weekly: 'Semanal',
            retrograde: 'Alertas de Mercurio Retrógrado',
            complexity: 'Complejidad del Horóscopo',
            simple: 'Simple',
            advanced: 'Avanzada',
            theme: 'Tema y Brillo',
            darkMode: 'Modo Oscuro Profundo',
            brightness: 'Intensidad del Brillo Neón',
            subtle: 'SUTIL',
            supernova: 'SUPERNOVA',
            support: 'Soporte y Ayuda',
            faq: 'Oráculo de Ayuda (FAQ)',
            contact: 'Contactar a los Guías',
            privacy: 'Privacidad y Seguridad',
            encryption: 'Cifrado Cuántico',
            encryptionDesc: 'Tus datos astrales están protegidos por una red de blockchain galáctica.',
            visibility: 'Visibilidad en el Nexo',
            ui: 'Ajustes de Interfaz',
            save: 'Guardar Ajustes',
            logout: 'CERRAR SESIÓN GALÁCTICA',
            saveAll: 'GUARDAR TODAS LAS SINCRONIZACIONES'
        },
        alignment: {
            title: 'ALINEACIÓN DE ALMA',
            subtitle: 'SECUENCIA DE CALIBRACIÓN CÓSMICA',
            mainTitle: 'INGRESA TUS COORDENADAS CELESTIALES',
            fullName: 'NOMBRE COMPLETO',
            birthDate: 'FECHA DE NACIMIENTO',
            birthTime: 'HORA DE NACIMIENTO',
            path: '¿Hacia qué camino celestial gravita tu espíritu naturalmente?',
            pathSolar: 'CAMINO SOLAR DE LA CREACIÓN',
            pathLunar: 'CAMINO LUNAR DE LA REFLEXIÓN',
            aura: 'Define la densidad actual del aura de tu alma',
            vision: 'Describe tu visión de la convergencia cósmica definitiva.',
            origin: 'ORIGEN TERRESTRE (PAÍS)',
            alignBtn: 'ALINEAR CON LAS ESTRELLAS',
            resetBtn: 'REINICIAR PROTOCOLO DE ALINEACIÓN'
        },
        nav: {
            home: 'Inicio Astral',
            chart: 'Carta Natal',
            predictions: 'Predicciones',
            compat: 'Vínculo del Alma',
            settings: 'Ajustes',
            history: 'Historia Estelar',
            logout: 'Cerrar Conexión',
            tagline: 'NODO CELESTIAL',
            premiumTitle: 'ACCESO INFINITO',
            premiumDesc: 'Desbloquea el mapa cósmico y los senderos estelares de 2024.',
            premiumBtn: 'SUBIR AL NIVEL PREMIUM',
            notifications: 'NOTIFICACIONES',
            markAll: 'Marcar todas',
            back: 'VOLVER',
            premium: 'PREMIUM'
        },
        home: {
            welcome: 'Bienvenido,',
            welcomeTitle: 'SALUDOS,',
            highlight: 'VIAJERO',
            welcomeSubtitle: 'Las constelaciones se alinean para tu expansión creativa hoy.',
            featuredTag: 'ILUMINACIÓN DORADA',
            featuredTitle: 'MAPEA LA CONSTELACIÓN COMPLETA DE TU DESTINO',
            featuredDesc: 'Desbloquea las cartas de retorno solar avanzadas y los ciclos planetarios que definen tu evolución personal para la próxima década.',
            revelBtn: 'REVELAR DESTINO',
            cosmicModules: '▲ MÓDULOS CÓSMICOS',
            geoTitle: 'GEOMETRÍA_ASTRAL',
            profileTitle: '✨ PERFIL CÓSMICO',
            modalTag: 'MÓDULO CÓSMICO',
            closeBtn: 'CERRAR',
            spirit: 'Buscador de Estrellas',
            exploreBtn: 'EXPLORAR EL COSMOS',
            readingTime: 'Tu flujo estelar está en fase ascendente.',
            insight: 'La alineación de hoy favorece nuevas revelaciones.',
            widgets: {
                zodiac: 'Tu Signo',
                reading: 'Lectura Diaria',
                destiny: 'Punto de Destino',
                vibrate: 'Vibración del Alma',
                aura: 'DENSIDAD DEL AURA'
            },
            zenith: {
                morning: 'AMANECER',
                noon: 'CÉNIT',
                sunset: 'OCASO',
                nadir: 'NADIR'
            }
        },
        revelation: {
            moduleTag: 'MÓDULO DE INTERACCIÓN',
            title: 'Revelación',
            subtitle: 'Numérica',
            backBtn: 'VOLVER AL NODO',
            vibrationLabel: 'VIBRACIÓN ACTUAL',
            vibrationDesc: '"Tu resonancia hoy indica un período de cierre y reflexión profunda. Escucha el silencio entre tus pensamientos."',
            synthTitle: 'SÍNTESIS CÓSMICA',
            nodesTitle: 'NODOS DE PODER HOY',
            oracleLabel: 'CONSEJO DEL ORÁCULO',
            statusComplete: 'ALINEACIÓN: COMPLETA',
            statusPending: 'ALINEACIÓN: PENDIENTE',
            essence: 'TU ESENCIA CENTRAL',
            newReading: 'GENERAR NUEVA REVELACIÓN',
            sintonizando: 'Sintonizando con el campo de conocimiento universal...',
            generateBtn: 'GENERAR NUEVA REVELACIÓN',
            closeBtn: 'CERRAR',
            sats: {
                expansion: { label: 'EXPANSIÓN', message: 'MENSAJE OCULTO: EXPANSIÓN' },
                balance: { label: 'EQUILIBRIO', message: 'ALINEACIÓN CÓSMICA: EQUILIBRIO' },
                energy: { label: 'ENERGÍA', message: 'FRECUENCIA ELEVADA: VITALIDAD' },
                vision: { label: 'VISIÓN', message: 'NODO ACTIVO: TRANSFORMACIÓN' }
            },
            pools: {
                lunar: {
                    creciente: 'Creciente',
                    nueva: 'Nueva',
                    llena: 'Llena',
                    cuartoCreciente: 'Cuarto Creciente',
                    cuartoMenguante: 'Cuarto Menguante'
                },
                energy: {
                    alta: 'Alta',
                    radiante: 'Radiante',
                    densa: 'Densa',
                    enraizada: 'Enraizada',
                    fluida: 'Fluida',
                    enFlujo: 'In Flujo',
                    sutil: 'Sutil',
                    eterea: 'Etérea'
                },
                freq: {
                    sana: 'Sana',
                    cosmica: 'Cósmica',
                    conexion: 'Conexión',
                    intuicion: 'Intuición'
                },
                synth: {
                    soul: { title: 'NÚMERO DEL ALMA', subtitle: 'ESENCIA INTERIOR', desc: 'Refleja tus deseos más profundos y la verdadera naturaleza de tu espíritu.' },
                    personality: { title: 'PERSONALIDAD', subtitle: 'IMAGEN EXTERNA', desc: 'Cómo te percibe el mundo y la máscara que muestras ante los demás.' },
                    mission: { title: 'MISIÓN DE VIDA', subtitle: 'HUMANITARIO', desc: 'Tu propósito final es el servicio a la humanidad y la culminación de ciclos.' },
                    builder: { title: 'MAESTRO CONSTRUCTOR', subtitle: 'PODER MATERIAL', desc: 'Capacidad para manifestar grandes visiones en el plano físico.' },
                    wisdom: { title: 'SABIDURÍA', subtitle: 'BUSCADOR', desc: 'Análisis profundo y búsqueda de verdades universales.' }
                },
                nodes: {
                    finance: { label: 'Finanzas', statuses: ['Próspero', 'Estable', 'En Crecimiento', 'Saneando'] },
                    love: { label: 'Amor', statuses: ['Estable', 'Vibrante', 'En Armonía', 'En Evolución'] },
                    career: { label: 'Carrera', statuses: ['Ascenso', 'Inspiración', 'Manifestación', 'Estabilidad'] },
                    health: { label: 'Salud', statuses: ['Vigorosa', 'En Equilibrio', 'Regeneración', 'Sutil'] }
                },
                oracle: [
                    "La confianza en el proceso es tu mayor aliada hoy...",
                    "Mira más allá de lo evidente, lo que buscas está cerca.",
                    "Un ciclo se cierra para dar paso a una luz más brillante.",
                    "Tu intuición es una brújula infalible en este momento.",
                    "La paciencia transformará el hierro en oro.",
                    "Sincroniza tu aliento con el latido del universo."
                ]
            }
        },
        natal: {
            loading: 'Calculando posiciones estelares...',
            heroTag: 'TU MAPA DEL CIELO',
            title: 'Carta Natal',
            subtitle: 'La configuración del cosmos al momento de tu primer aliento.',
            triad: {
                sol: 'SOL / IDENTIDAD',
                luna: 'LUNA / EMOCIÓN',
                asc: 'ASCENDENTE / SER'
            },
            sections: {
                elements: 'Equilibrio Elemental',
                planets: 'Posiciones Planetarias'
            },
            cta: {
                title: 'Tu Guía Evolutiva Personalizada',
                desc: 'Descubre cómo transitar los mayores retos de tu alma y aprovechar tus dones kármicos en este ciclo.',
                btn: 'DESBLOQUEAR INFORME DE 40 PÁGINAS ✦'
            },
            footer: 'Astralis Natal Services. Todos los derechos reservados.',
            privacy: 'Privacidad',
            ethics: 'Ética Astral'
        },
        lectures: {
            loading: 'Sincronizando con el cosmos...',
            heroTag: 'LA VIBRACIÓN DEL AHORA',
            dailyAdvice: 'Consejo Diario',
            astralGuide: 'GUÍA ASTRAL',
            freq: 'FRECUENCIA',
            fullAnalysis: 'Leer análisis completo →',
            stats: {
                moon: 'FASE LUNAR',
                planet: 'PLANETA ACTIVO',
                luck: 'NIVEL DE SUERTE',
                solar: 'INFLUENCIA SOLAR',
                luckSuffix: 'de Suerte'
            },
            cta: 'GENERAR INFORME PERSONAL COMPLETO',
            footer: 'Colectivo de Numerología Astralis. Todos los derechos reservados.',
            privacy: 'Política de Privacidad',
            terms: 'Términos Cósmicos',
            contact: 'Contacto',
            defaultReading: {
                titulo: 'El Buscador de la Verdad',
                descripcion: 'La energía de hoy invita a la introspección, el análisis profundo y una conexión con los reinos invisibles del universo.',
                consejo: 'El número 7 representa el puente entre lo material y lo espiritual. En este día, la alineación cósmica favorece a quienes miran bajo la superficie. No es un día para multitudes ruidosas o actividad bulliciosa, sino para la quietud del alma.'
            },
            checklist: [
                { title: 'Abraza la Soledad', desc: 'Dedica al menos 30 comunicación para escuchar tu brújula interna.' },
                { title: 'Cuestiona las Suposiciones', desc: 'Una verdad que has sostenido puede estar lista para evolucionar.' },
                { title: 'Evita las Prisas', desc: 'La energía de hoy es lenta y deliberada. Forzar comunicación provocará fricción.' }
            ]
        },
        compatibility: {
            heroTag: 'ALINEACIÓN VIBRACIONAL',
            title: 'Compatibilidad',
            desc: 'Descubre cómo tus números se entrelazan con otra esencia en el tejido cósmico.',
            partnerTitle: 'Segunda Esencia',
            nameLabel: 'NOMBRE CELESTIAL',
            namePlaceholder: 'Nombre completo',
            dateLabel: 'FECHA DE ALINEACIÓN',
            syncBtn: 'SINCRONIZAR ALMAS ✦',
            emptyText: 'Ingresa la esencia del acompañante para iniciar el análisis de sincronía.',
            syncing: 'Sintonizando frecuencias compartidas...',
            result: {
                high: 'SINCRO-ESTELAR ALTA',
                desc: 'Sus vibraciones resuenan en una frecuencia armónica. Existe una alineación natural entre sus caminos evolutivos.',
                areas: {
                    comm: 'Comunicación',
                    emotion: 'Emoción',
                    spirit: 'Espiritual'
                }
            },
            footer: 'Astralis Resonance. Todos los derechos reservados.',
            privacy: 'Privacidad',
            privacyAlert: 'Tu sincronía es sagrada y private.'
        },
        history: {
            title: 'HISTORIA ESTELAR',
            subtitle: 'CAMINO DE NUMEROLOGÍA ASTRAL',
            nav: {
                panel: 'PANEL',
                chronology: 'CRONOLOGÍA',
                arcana: 'ARCANOS'
            },
            timelineTitle: 'Línea de Tiempo',
            timelineHighlight: 'Cósmica',
            timelineDesc: 'Rastreando su viaje numerológico a través del vacío.',
            filters: {
                alignment: 'ALINEACIÓN',
                era: 'ÉPOCA',
                all: 'Todas las Radiaciones',
                transits: 'Tránsitos',
                numerology: 'Numerología',
                maps: 'Mapas',
                sun7: 'Últimos 7 Soles',
                sun30: 'Últimos 30 Soles',
                sun90: 'Últimos 90 Soles',
                allTime: 'Toda la Historia'
            },
            empty: {
                title: 'EL VACÍO PRIMORDIAL',
                desc: 'Tu historia en ASTRA comienza hoy. En las próximas rotaciones terrestres, tus tránsitos y lecturas aparecerán aquí como constelaciones en el vacío.',
                btn: 'COMENZAR PRIMERA LECTURA'
            },
            descendBtn: 'DESCENDER MÁS PROFUNDO EN LA HISTORIA',
            stats: {
                user: 'USUARIO',
                plan: 'PLAN',
                start: 'INICIO',
                status: 'ESTADO',
                planLunar: 'NIVEL LUNAR (BÁSICO)',
                complete: 'ALINEACIÓN COMPLETA',
                pending: 'ALINEACIÓN PENDIENTE'
            },
            footer: {
                currentAlign: 'ALINEACIÓN ACTUAL',
                neptune: 'NEPTUNO EN RETRÓGRADO • 24° 12\' PI',
                ethics: 'ÉTICA UNIVERSAL',
                voidPolicy: 'POLÍTICA DEL VACÍO',
                api: 'API ASTRAL',
                corp: 'STELLAR NUMEROLOGY CORPS.'
            },
            events: [
                {
                    type: 'TRÁNSITO',
                    title: 'Umbral del Retorno de Saturno',
                    labels: ['CAMINO DE VIDA 7', 'DOMINANTE 4'],
                    desc: '"La alineación sugiere una profunda reestructuración de las deudas kármicas mientras Saturno entra en tu tercera casa de la sabiduría..."'
                },
                {
                    type: 'NUMEROLOGÍA',
                    title: 'El Número Maestro 11',
                    labels: ['NÚCLEO 11', 'VIBRACIÓN ALTA'],
                    desc: '"Se están abriendo portales intuitivos. Su resonancia vibratoria se ha desplazado de la frecuencia material a la espiritual..."'
                },
                {
                    type: 'MAPA ASTRAL',
                    title: 'Manifestación Directa de Mercurio',
                    labels: ['MERCURY 2', 'VOZ CLARA'],
                    desc: '"El trabajo de sombra se completa. Un período de comunicación sin precedentes y éxito contractual comienza ahora..."'
                },
                {
                    type: 'SINCRONÍA VITAL',
                    title: 'Convergencia Armónica',
                    labels: ['NÚCLEO ABRL', 'SOLAR 4'],
                    desc: '"Se ha alcanzado el pico de alineación energética. Esto marca el comienzo de su ciclo de destino principal para el año..."'
                }
            ]
        },
        horoscope: {
            heroTag: 'PREDICCIÓN DIARIA',
            title: 'Horóscopo',
            vibration: 'Vibración del día: ',
            vibrationVal: 'Armonía Celeste',
            masterAdvice: 'Consejo del Maestro',
            masterQuote: '"La paciencia es la forma en que el tiempo rinde culto a la eternidad. No apresures lo que el cosmos está tejiendo a tu favor."',
            masterSig: '- EL GUÍA -',
            luckyNumbers: 'Números de Poder',
            footer: 'Astralis Daily. Todos los derechos reservados.',
            privacy: 'Privacidad',
            privacyAlert: 'Tu destino es privado bajo la ley del Oráculo.',
            categories: {
                love: 'Amor',
                work: 'Trabajo',
                health: 'Salud',
                money: 'Dinero'
            },
            predictions: {
                love: 'Las alineaciones de Venus sugieren un periodo de apertura emocional. Si estás en pareja, es momento de renovar compromisos. Si buscas, alguien del pasado podría reaparecer con una nueva perspectiva.',
                work: 'Marte en tu casa del éxito impulsa proyectos estancados. No temas tomar la iniciativa en esa reunión importante. Tu visión clara será recompensada por figuras de autoridad.',
                health: 'La energía de hoy pide descanso regenerativo. Evita el estrés innecesario y busca contacto con la naturaleza. Un baño de sal marina o meditación antes de dormir será clave.',
                money: 'Júpiter protege tus finanzas, pero Mercurio advierte sobre gastos impulsivos. Una oportunidad de inversión a largo plazo se presentará el viernes. Analiza los detalles con calma.'
            }
        },
        subscriptions: {
            notifTitle: 'ALINEACIÓN EXITOSA',
            notifDesc: 'Has ascendido al {plan}. Reiniciando parámetros cósmicos...',
            heroTag: 'SUSCRIPCIÓN CELESTIAL',
            title: 'DIMENSIONES CÓSMICAS',
            desc: 'Alinea tu frecuencia con los cuerpos celestes. Cada dimensión desbloquea capas profundas de la geometría astral que rige tu destino.',
            historyBtn: 'HISTORIAL DE PAGOS',
            ascendBtn: 'ASCENDER AHORA',
            footer: {
                wisdom: 'SABIDURÍA ANCESTRAL',
                wisdomDesc: 'ALGORITMOS BASADOS EN 4.000 AÑOS DE CIENCIA CALDEA.',
                protection: 'PROTECCIÓN DEL ALMA',
                protectionDesc: 'BÓVEDAS DE DATOS ESPIRITUALES ENCRIPTADOS.',
                ephemeris: 'EFEMÉRIDES DIARIAS',
                ephemerisDesc: 'FLUJOS DE DATOS PRECISOS DE OBSERVATORIOS GLOBALES.',
                sync: 'SINCRONÍA ETÉREA',
                syncDesc: 'ALERTAS EN TIEMPO REAL DE CAMBIOS ASTRALES.',
                voidProt: 'PROTOCOLOS DEL VACÍO',
                astralTerms: 'TÉRMINOS ASTRALES',
                cookies: 'COOKIES NEURALES',
                voidAlert: 'Protocolos de cifrado cuántico activos.',
                termsAlert: 'Términos regidos por la ley galáctica de 2024.',
                cookiesAlert: 'Cookies residuales del Big Bang aceptadas.'
            },
            plans: {
                lunar: {
                    name: 'NIVEL LUNAR',
                    code: '(LUNAR)',
                    description: 'Primer reflejo: Trabajo de sombras y ciclos lunares básicos para el buscador naciente.',
                    features: ['TRÁNSITOS DIARIOS', 'FASE LUNAR PERSONAL', 'CARTOGRAFÍA BÁSICA']
                },
                planetario: {
                    name: 'NIVEL PLANETARIO',
                    code: '(PLANETARIO)',
                    description: 'Conciencia orbital: Alineación avanzada con las estrellas errantes de nuestro sistema.',
                    features: ['CHAT IA ILIMITADO', 'SINASTRÍA DETALLADA', 'HORAS PLANETARIAS', 'ARCHIVOS VITALES']
                },
                supernova: {
                    name: 'NIVEL SUPERNOVA',
                    code: '(SUPERNOVA)',
                    tag: 'MÁS RADIANTE',
                    description: 'Comunión directa con la fuente. Integración astral total y expansión estelar.',
                    features: ['CONSULTORÍA ASTRAL DIRECTA', 'CHAT IA ILIMITADO', 'GEOMETRÍA PERSONALIZADA', 'EVENTOS ASTRAL VIP']
                }
            }
        },
        payments: {
            sidebar: {
                map: 'Mapa Cósmico',
                vault: 'Bóveda de Energía',
                settings: 'Ajustes',
                level: 'Nivel: '
            },
            header: {
                back: '← Regresar',
                title: 'Energía y Cambios',
                subtitle: 'Administra tus inversiones cósmicas y suscripciones de nivel planetario.'
            },
            stats: {
                totalLabel: 'TOTAL ENERGÍA INVERTIDA',
                trendLive: 'Actualizado en tiempo real',
                trendBase: 'Nivel base inicial',
                astralLabel: 'NIVEL ASTRAL ACTUAL',
                nextAlign: 'Siguiente ascenso disponible',
                nextLabel: 'PRÓXIMA ALINEACIÓN',
                daysLeft: 'DÍAS RESTANTES'
            },
            history: {
                title: 'Historial de Intercambios Cósmicos',
                filter: 'FILTRAR',
                export: 'EXPORTAR',
                date: 'FECHA',
                detail: 'DETALLE',
                amount: 'MONTO',
                action: 'ACCIÓN',
                invoice: 'FACTURA',
                levelLabel: 'Nivel: ',
                footerPrefix: 'Mostrando ',
                footerSuffix: ' alineaciones registradas'
            },
            empty: {
                title: 'Bóveda Estelar Vacía',
                desc: 'Aún no has reclamado tus tesoros estelares. Inicia tu primera inversión para desbloquear los secretos de las dimensiones cósmicas.',
                btn: 'INICIAR ASCENSIÓN'
            }
        },
        checkout: {
            backBtn: '← VOLVER A PLANES',
            title: 'TERMINAL CÓSMICA',
            subtitle: 'TRANSACCIÓN ASTRAL ASEGURADA',
            originLabel: 'ORIGEN_DETECTADO',
            pickerTitle: 'SELECCIONA TU DIMENSIÓN',
            summaryTitle: 'RESUMEN DE ORDEN',
            changeBtn: 'CAMBIAR',
            localValueLabel: 'VALOR EN TU MONEDA:',
            tabs: {
                card: '💳 Tarjeta Astral',
                digital: '📱 Billetera Digital'
            },
            form: {
                holderLabel: 'NOMBRE DE AUTORIDAD DEL NAVEGANTE',
                holderPlaceholder: 'ELARA VANCE',
                cardLabel: 'ID DE SECUENCIA INTERESTELAR',
                cardPlaceholder: 'XXXX XXXX XXXX XXXX',
                expiryLabel: 'LÍMITE TEMPORAL',
                expiryPlaceholder: 'MM/YY',
                cvvLabel: 'CIFRADO DE ACCESO',
                cvvPlaceholder: '***',
                syncBtn: '⚡ SINCRONIZAR ACTIVOS',
                syncingBtn: 'SINCRONIZANDO CON LA RED VESTA...'
            },
            alt: {
                label: 'O VINCULAR VÍA NODO DIGITAL',
                apple: 'Apple Pay se está sincronizando con tu ID Estelar.',
                wallet: 'Billetera Universal en fase de acoplamiento.',
                crypto: 'Protocolo Cripto Leya-7 activándose.',
                appleLabel: 'APPLE PAY',
                walletLabel: 'BILLETERA',
                cryptoLabel: 'CRIPTO'
            },
            cardPreview: {
                holder: 'NOMBRE DEL NAVEGANTE'
            },
            alerts: {
                fillFields: 'Por favor, complete los campos de sincronización astral.',
                noPlan: 'No hay un plan seleccionado para la sincronización.',
                success: '¡Sincronización Exitosa! Tu alma ha ascendido.'
            },
            currencies: {
                'CO': 'PESOS COLOMBIANOS',
                'ES': 'EUROS',
                'EU': 'EUROS',
                'MX': 'PESOS MEXICANOS',
                'AR': 'PESOS ARGENTINOS',
                'CL': 'PESOS CHILENOS',
                'PE': 'SOLES',
                'US': 'DÓLARES'
            }
        },
        auth: {
            identity: 'IDENTIDAD CÓSMICA',
            subtitle: 'Elige tu rol para iniciar tu viaje',
            chooseEssence: 'Elegir Esencia',
            access: 'ACCESO ESTELAR',
            syncingAs: 'Sincronizando como',
            back: 'Volver',
            tabs: {
                sync: 'Sincronizar',
                transcend: 'Trascender (Registro)'
            },
            roles: {
                traveler: { name: 'VIAJERO ASTRAL', label: 'VIAJERO', desc: 'Sigue la huella de los números en tu vida.' },
                guide: { name: 'GUÍA CÓSMICO', label: 'GUÍA', desc: 'Interpreta y comparte la sabiduría estelar.' }
            },
            fields: {
                identityLabel: 'IDENTIDAD CELESTIAL // ESENCIA',
                identityPlaceholder: 'cosmos@astral.mail',
                sigilLabel: 'LLAVE VIBRACIONAL // SIGILO',
                sigilPlaceholder: '••••••••',
                nameLabel: 'NOMBRE CELESTIAL',
                namePlaceholder: 'Tu nombre en el cosmos',
                emailLabel: 'CORREO DE ENLACE',
                passLabel: 'NUEVO SIGILO',
                passPlaceholder: 'Contraseña segura',
                dateLabel: 'FECHA DE ALINEACIÓN (NACIMIENTO)'
            },
            options: {
                anchor: 'ANCLAR PRESENCIA',
                forgot: '¿OLVIDASTE TU SIGILO?',
                others: 'OTROS ACCESOS DIMENSIONALES',
                oracle: 'SINCRONÍA ORACLE',
                ether: 'ENLACE ÉTER'
            },
            buttons: {
                login: 'INICIAR SESIÓN 🧭',
                register: 'CREAR CUENTA ESTELAR ✦'
            },
            footer: {
                ethics: 'ÉTICA ZEN',
                harmony: 'ARMONÍA CSS',
                void: 'VACÍO MAP',
                tagline: 'NUMEROLOGÍA CÓSMICA'
            },
            alerts: {
                fillFields: 'Por favor completa todos los campos.',
                success: '¡Sintonización completada! Ahora puedes iniciar sesión.',
                ethicsMsg: 'La ética Zen rige nuestro algoritmo.',
                harmonyMsg: 'Armonía visual sintonizada.',
                voidMsg: 'Mapeando el vacío cuántico...'
            }
        },
        report: {
            overlay: {
                title: 'TEJIENDO TU MAPA DEL DESTINO',
                sync: 'Sincronizando registros akásicos'
            },
            header: {
                back: '← VOLVER',
                logo: 'ASTRAL PRESTIGE',
                download: 'DESCARGAR PDF 📥'
            },
            hero: {
                tag: 'INFORME PERSONAL EXCLUSIVO',
                vibration: 'VIBRACIÓN MAESTRA:'
            },
            pillars: {
                identity: { title: 'IDENTIDAD', value: 'Solar', desc: 'Núcleo de vitalidad dominante.' },
                path: { title: 'CAMINO', value: 'Evolutivo', desc: 'Dirección de alma para este ciclo.' },
                freq: { title: 'FRECUENCIA', value: 'Elevada', desc: 'Nivel del campo electromagnético.' }
            },
            modules: {
                numerology: { title: 'Matriz Numerológica', content: 'Tus números base (3, 7, 11) indican un periodo de transmutación kármica a través del conocimiento.' },
                astrology: { title: 'Pulso Planetario', content: 'Júpiter en conjunción con tu casa de la abundancia sugiere un flujo de prosperidad inesperado.' },
                aura: { title: 'Estado del Aura', content: 'Tu aura presenta tonalidades índigo con destellos dorados, indicando una protección etérea activa.' }
            },
            certification: {
                desc: 'Este informe ha sido generado bajo las leyes de la geometría sagrada y la resonancia estelar.',
                signature: 'Consejo de Astralis'
            },
            footer: '© 2024 Astralis Advanced Analytics. Todos los derechos cósmicos reservados.',
            alerts: {
                preparing: 'Preparando transmisión de datos para PDF...',
                encrypted: 'Tu destino está encriptado con protocolos de clase S.'
            },
            defaults: {
                name: 'VIAJERO ASTRAL',
                role: 'BUSCADOR CÓSMICO',
                summary: 'Tu esencia vibra en una frecuencia de liderazgo espiritual y construcción material. El alineamiento actual favorece la expansión de tu red de influencia.'
            }
        }
    },
    en: {
        settings: {
            title: 'Astral',
            subtitle: 'Settings',
            welcome: 'System adjustments',
            syncBtn: 'Sync DNA',
            language: 'System Language',
            langEs: 'Spanish',
            langEn: 'English',
            notifFreq: 'Notification Frequency',
            daily: 'Daily',
            weekly: 'Weekly',
            retrograde: 'Mercury Retrograde Alerts',
            complexity: 'Horoscope Complexity',
            simple: 'Simple',
            advanced: 'Advanced',
            theme: 'Theme & Brightness',
            darkMode: 'Deep Dark Mode',
            brightness: 'Neon Glow Intensity',
            subtle: 'SUBTLE',
            supernova: 'SUPERNOVA',
            support: 'Support & Help',
            faq: 'Help Oracle (FAQ)',
            contact: 'Contact the Guides',
            privacy: 'Privacy & Security',
            encryption: 'Quantum Encryption',
            encryptionDesc: 'Your astral data is protected by a galactic blockchain network.',
            visibility: 'Visibility in the Nexo',
            ui: 'Interface Adjustments',
            save: 'Save Settings',
            logout: 'LOGOUT GALACTIC SESSION',
            saveAll: 'SAVE ALL SYNCHRONIZATIONS'
        },
        alignment: {
            title: 'SOUL ALIGNMENT',
            subtitle: 'COSMIC CALIBRATION SEQUENCE',
            mainTitle: 'ENTER YOUR CELESTIAL COORDINATES',
            fullName: 'FULL NAME',
            birthDate: 'DATE OF BIRTH',
            birthTime: 'TIME OF BIRTH',
            path: 'Which celestial path does your spirit naturally gravitate towards?',
            pathSolar: 'SOLAR PATH OF CREATION',
            pathLunar: 'LUNAR PATH OF REFLECTION',
            aura: 'Define the current density of your soul\'s aura',
            vision: 'Describe your vision of the ultimate cosmic convergence.',
            origin: 'EARTHLY ORIGIN (COUNTRY)',
            alignBtn: 'ALIGN WITH THE STARS',
            resetBtn: 'RESTART ALIGNMENT PROTOCOL'
        },
        nav: {
            home: 'Astral Home',
            chart: 'Natal Chart',
            predictions: 'Predictions',
            compat: 'Soul Link',
            settings: 'Settings',
            history: 'Stellar History',
            logout: 'Log Out',
            tagline: 'CELESTIAL NODE',
            premiumTitle: 'INFINITE ACCESS',
            premiumDesc: 'Unlock the cosmic map and stellar paths of 2024.',
            premiumBtn: 'UPGRADE TO PREMIUM',
            notifications: 'NOTIFICATIONS',
            markAll: 'Mark all as read',
            back: 'BACK',
            premium: 'PREMIUM'
        },
        home: {
            welcome: 'Welcome,',
            welcomeTitle: 'GREETINGS,',
            highlight: 'TRAVELER',
            welcomeSubtitle: 'The constellations align for your creative expansion today.',
            featuredTag: 'GOLDEN ILLUMINATION',
            featuredTitle: 'MAP THE COMPLETE CONSTELLATION OF YOUR DESTINY',
            featuredDesc: 'Unlock advanced solar return charts and planetary cycles that define your personal evolution for the next decade.',
            revelBtn: 'REVEAL DESTINY',
            cosmicModules: '▲ COSMIC MODULES',
            geoTitle: 'ASTRAL_GEOMETRY',
            profileTitle: '✨ COSMIC PROFILE',
            modalTag: 'COSMIC MODULE',
            closeBtn: 'CLOSE',
            spirit: 'Star Seeker',
            exploreBtn: 'EXPLORE THE COSMOS',
            readingTime: 'Your stellar flow is in an upward phase.',
            insight: 'Today\'s alignment favors new revelations.',
            widgets: {
                zodiac: 'Your Sign',
                reading: 'Daily Reading',
                destiny: 'Destiny Point',
                vibrate: 'Soul Vibration',
                aura: 'AURA DENSITY'
            },
            zenith: {
                morning: 'DAWN',
                noon: 'ZENITH',
                sunset: 'SUNSET',
                nadir: 'NADIR'
            }
        },
        revelation: {
            moduleTag: 'INTERACTION MODULE',
            title: 'Numeric',
            subtitle: 'Revelation',
            backBtn: 'BACK TO NODE',
            vibrationLabel: 'CURRENT VIBRATION',
            vibrationDesc: '"Your resonance today indicates a period of closure and deep reflection. Listen to the silence between your thoughts."',
            synthTitle: 'COSMIC SYNTHESIS',
            nodesTitle: 'POWER NODES TODAY',
            oracleLabel: 'ORACLE ADVICE',
            statusComplete: 'ALIGNMENT: COMPLETE',
            statusPending: 'ALIGNMENT: PENDING',
            essence: 'YOUR CENTRAL ESSENCE',
            newReading: 'GENERATE NEW REVELATION',
            sintonizando: 'Tuning into the universal field of knowledge...',
            generateBtn: 'GENERATE NEW REVELATION',
            closeBtn: 'CLOSE',
            sats: {
                expansion: { label: 'EXPANSION', message: 'HIDDEN MESSAGE: EXPANSION' },
                balance: { label: 'BALANCE', message: 'COSMIC ALIGNMENT: BALANCE' },
                energy: { label: 'ENERGY', message: 'HIGH FREQUENCY: VITALITY' },
                vision: { label: 'VISION', message: 'ACTIVE NODE: TRANSFORMATION' }
            },
            pools: {
                lunar: {
                    creciente: 'Waxing',
                    nueva: 'New',
                    llena: 'Full',
                    cuartoCreciente: 'First Quarter',
                    cuartoMenguante: 'Last Quarter'
                },
                energy: {
                    alta: 'High',
                    radiante: 'Radiant',
                    densa: 'Dense',
                    enraizada: 'Grounded',
                    fluida: 'Fluid',
                    enFlujo: 'In Flow',
                    sutil: 'Subtle',
                    eterea: 'Ethereal'
                },
                freq: {
                    sana: 'Healing',
                    cosmica: 'Cosmic',
                    conexion: 'Connection',
                    intuicion: 'Intuition'
                },
                synth: {
                    soul: { title: 'SOUL NUMBER', subtitle: 'INNER ESSENCE', desc: 'Reflects your deepest desires and the true nature of your spirit.' },
                    personality: { title: 'PERSONALITY', subtitle: 'OUTER IMAGE', desc: 'How the world perceives you and the mask you show to others.' },
                    mission: { title: 'LIFE MISSION', subtitle: 'HUMANITARIAN', desc: 'Your ultimate purpose is service to humanity and the culmination of cycles.' },
                    builder: { title: 'MASTER BUILDER', subtitle: 'MATERIAL POWER', desc: 'Ability to manifest great visions in the physical plane.' },
                    wisdom: { title: 'WISDOM', subtitle: 'SEEKER', desc: 'Deep analysis and search for universal truths.' }
                },
                nodes: {
                    finance: { label: 'Finances', statuses: ['Prosperous', 'Stable', 'In Growth', 'Healing'] },
                    love: { label: 'Love', statuses: ['Stable', 'Vibrant', 'In Harmony', 'In Evolution'] },
                    career: { label: 'Career', statuses: ['Ascent', 'Inspiration', 'Manifestation', 'Stability'] },
                    health: { label: 'Health', statuses: ['Vigorous', 'In Balance', 'Regeneration', 'Subtle'] }
                },
                oracle: [
                    "Trust in the process is your greatest ally today...",
                    "Look beyond the obvious, what you seek is close.",
                    "A cycle closes to make way for a brighter light.",
                    "Your intuition is an infallible compass right now.",
                    "Patience will transform iron into gold.",
                    "Synchronize your breath with the heartbeat of the universe."
                ]
            }
        },
        natal: {
            loading: 'Calculating stellar positions...',
            heroTag: 'YOUR SKY MAP',
            title: 'Natal Chart',
            subtitle: 'The configuration of the cosmos at the moment of your first breath.',
            triad: {
                sol: 'SUN / IDENTITY',
                luna: 'MOON / EMOTION',
                asc: 'ASCENDANT / SELF'
            },
            sections: {
                elements: 'Elemental Balance',
                planets: 'Planetary Positions'
            },
            cta: {
                title: 'Your Personalized Evolutionary Guide',
                desc: 'Discover how to navigate your soul\'s greatest challenges and leverage your karmic gifts in this cycle.',
                btn: 'UNLOCK 40-PAGE REPORT ✦'
            },
            footer: 'Astralis Natal Services. All rights reserved.',
            privacy: 'Privacy',
            ethics: 'Astral Ethics'
        },
        lectures: {
            loading: 'Synchronizing with the cosmos...',
            heroTag: 'THE VIBRATION OF NOW',
            dailyAdvice: 'Daily Advice',
            astralGuide: 'ASTRAL GUIDE',
            freq: 'FREQUENCY',
            fullAnalysis: 'Read full analysis →',
            stats: {
                moon: 'LUNAR PHASE',
                planet: 'ACTIVE PLANET',
                luck: 'LUCK LEVEL',
                solar: 'SOLAR INFLUENCE',
                luckSuffix: 'Luck'
            },
            cta: 'GENERATE FULL PERSONAL REPORT',
            footer: 'Astralis Numerology Collective. All rights reserved.',
            privacy: 'Privacy Policy',
            terms: 'Cosmic Terms',
            contact: 'Contact',
            defaultReading: {
                titulo: 'The Truth Seeker',
                descripcion: 'Today\'s energy invites introspection, deep analysis, and a connection with the invisible realms of the universe.',
                consejo: 'Number 7 represents the bridge between the material and the spiritual. On this day, cosmic alignment favors those who look beneath the surface. It is not a day for noisy crowds, but for the stillness of the soul.'
            },
            checklist: [
                { title: 'Embrace Solitude', desc: 'Spend at least 30 minutes in silence to listen to your inner compass.' },
                { title: 'Question Assumptions', desc: 'A truth you have held may be ready to evolve.' },
                { title: 'Avoid Rushing', desc: 'Today\'s energy is slow and deliberate. Forcing results will cause friction.' }
            ]
        },
        compatibility: {
            heroTag: 'VIBRATIONAL ALIGNMENT',
            title: 'Compatibility',
            desc: 'Discover how your numbers intertwine with another essence in the cosmic fabric.',
            partnerTitle: 'Second Essence',
            nameLabel: 'CELESTIAL NAME',
            namePlaceholder: 'Full name',
            dateLabel: 'ALIGNMENT DATE',
            syncBtn: 'SYNCHRONIZE SOULS ✦',
            emptyText: 'Enter the companion\'s essence to initiate the synchronicity analysis.',
            syncing: 'Synchronizing shared frequencies...',
            result: {
                high: 'HIGH STELLAR SYNC',
                desc: 'Your vibrations resonate at a harmonic frequency. There is a natural alignment between your evolutionary paths.',
                areas: {
                    comm: 'Communication',
                    emotion: 'Emotion',
                    spirit: 'Spiritual'
                }
            },
            footer: 'Astralis Resonance. All rights reserved.',
            privacy: 'Privacy',
            privacyAlert: 'Your synchronicity is sacred and private.'
        },
        history: {
            title: 'STELLAR HISTORY',
            subtitle: 'ASTRAL NUMEROLOGY PATH',
            nav: {
                panel: 'DASHBOARD',
                chronology: 'CHRONOLOGY',
                arcana: 'ARCANA'
            },
            timelineTitle: 'Cosmic',
            timelineHighlight: 'Timeline',
            timelineDesc: 'Tracking your numerological journey through the void.',
            filters: {
                alignment: 'ALIGNMENT',
                era: 'ERA',
                all: 'All Radiations',
                transits: 'Transits',
                numerology: 'Numerology',
                maps: 'Maps',
                sun7: 'Last 7 Suns',
                sun30: 'Last 30 Suns',
                sun90: 'Last 90 Suns',
                allTime: 'All History'
            },
            empty: {
                title: 'THE PRIMEVAL VOID',
                desc: 'Your journey in ASTRA begins today. In the next Earth rotations, your transits and revelations will appear here like constellations in the void.',
                btn: 'START FIRST READING'
            },
            descendBtn: 'DESCEND DEEPER INTO HISTORY',
            stats: {
                user: 'USER',
                plan: 'PLAN',
                start: 'START',
                status: 'STATUS',
                planLunar: 'LUNAR LEVEL (BASIC)',
                complete: 'ALIGNMENT COMPLETE',
                pending: 'ALIGNMENT PENDING'
            },
            footer: {
                currentAlign: 'CURRENT ALIGNMENT',
                neptune: 'NEPTUNE IN RETROGRADE • 24° 12\' PI',
                ethics: 'UNIVERSAL ETHICS',
                voidPolicy: 'VOID POLICY',
                api: 'ASTRAL API',
                corp: 'STELLAR NUMEROLOGY CORPS.'
            },
            events: [
                {
                    type: 'TRANSIT',
                    title: 'Saturn\'s Return Threshold',
                    labels: ['LIFE PATH 7', 'DOMINANT 4'],
                    desc: '"The alignment suggests a profound restructuring of karmic debts as Saturn enters your third house of wisdom..."'
                },
                {
                    type: 'NUMEROLOGÍA',
                    title: 'Master Number 11',
                    labels: ['CORE 11', 'HIGH VIBRATION'],
                    desc: '"Intuitive portals are opening. Your vibratory resonance has shifted from material to spiritual frequency..."'
                },
                {
                    type: 'ASTRAL MAP',
                    title: 'Mercury Direct Manifestation',
                    labels: ['MERCURY 2', 'CLEAR VOICE'],
                    desc: '"Shadow work is complete. A period of unprecedented communication and contractual success begins now..."'
                },
                {
                    type: 'VITAL SYNC',
                    title: 'Harmonic Convergence',
                    labels: ['ABRL CORE', 'SOLAR 4'],
                    desc: '"Peak energy alignment has been reached. This marks the beginning of your main destiny cycle for the year..."'
                }
            ]
        },
        horoscope: {
            heroTag: 'DAILY PREDICTION',
            title: 'Horoscope',
            vibration: 'Vibration of the day: ',
            vibrationVal: 'Celestial Harmony',
            masterAdvice: 'Master\'s Advice',
            masterQuote: '"Patience is the way time renders worship to eternity. Do not rush what the cosmos is weaving in your favor."',
            masterSig: '- THE GUIDE -',
            luckyNumbers: 'Power Numbers',
            footer: 'Astralis Daily. All rights reserved.',
            privacy: 'Privacy',
            privacyAlert: 'Your destiny is private under the Law of the Oracle.',
            categories: {
                love: 'Love',
                work: 'Work',
                health: 'Health',
                money: 'Money'
            },
            predictions: {
                love: 'Venus alignments suggest a period of emotional openness. If you are in a relationship, it is time to renew commitments. If you are seeking, someone from the past might reappear with a new perspective.',
                work: 'Mars in your house of success drives stagnant projects. Do not fear taking initiative in that important meeting. Your clear vision will be rewarded by authority figures.',
                health: 'Today\'s energy calls for regenerative rest. Avoid unnecessary stress and seek contact with nature. A sea salt bath or meditation before bed will be key.',
                money: 'Jupiter protects your finances, but Mercury warns of impulsive spending. A long-term investment opportunity will present itself on Friday. Analyze the details calmly.'
            }
        },
        subscriptions: {
            notifTitle: 'SUCCESSFUL ALIGNMENT',
            notifDesc: 'You have ascended to {plan}. Resetting cosmic parameters...',
            heroTag: 'CELESTIAL SUBSCRIPTION',
            title: 'COSMIC DIMENSIONS',
            desc: 'Align your frequency with the celestial bodies. Each dimension unlocks deep layers of the astral geometry that rules your destiny.',
            historyBtn: 'PAYMENT HISTORY',
            ascendBtn: 'ASCEND NOW',
            footer: {
                wisdom: 'ANCESTRAL WISDOM',
                wisdomDesc: 'ALGORITHMS BASED ON 4,000 YEARS OF CHALDEAN SCIENCE.',
                protection: 'SOUL PROTECTION',
                protectionDesc: 'ENCRYPTED SPIRITUAL DATA VAULTS.',
                ephemeris: 'DAILY EPHEMERIS',
                ephemerisDesc: 'ACCURATE DATA FLOWS FROM GLOBAL OBSERVATORIES.',
                sync: 'ETHEREAL SYNCHRONICITY',
                syncDesc: 'REAL-TIME ALERTS OF ASTRAL CHANGES.',
                voidProt: 'VOID PROTOCOLS',
                astralTerms: 'ASTRAL TERMS',
                cookies: 'NEURAL COOKIES',
                voidAlert: 'Quantum encryption protocols active.',
                termsAlert: 'Terms governed by the galactic law of 2024.',
                cookiesAlert: 'Residual Big Bang cookies accepted.'
            },
            plans: {
                lunar: {
                    name: 'LUNAR LEVEL',
                    code: '(LUNAR)',
                    description: 'First reflection: Shadow work and basic lunar cycles for the nascent seeker.',
                    features: ['DAILY TRANSITS', 'PERSONAL LUNAR PHASE', 'BASIC CARTOGRAPHY']
                },
                planetario: {
                    name: 'PLANETARY LEVEL',
                    code: '(PLANETARY)',
                    description: 'Orbital consciousness: Advanced alignment with the wandering stars of our system.',
                    features: ['UNLIMITED AI CHAT', 'DETAILED SYNASTRY', 'PLANETARY HOURS', 'VITAL ARCHIVES']
                },
                supernova: {
                    name: 'SUPERNOVA LEVEL',
                    code: '(SUPERNOVA)',
                    tag: 'BRIGHTEST',
                    description: 'Direct communion with the source. Total astral integration and stellar expansion.',
                    features: ['DIRECT ASTRAL CONSULTANCY', 'UNLIMITED AI CHAT', 'PERSONALIZED GEOMETRY', 'VIP ASTRAL EVENTS']
                }
            }
        },
        payments: {
            sidebar: {
                map: 'Cosmic Map',
                vault: 'Energy Vault',
                settings: 'Settings',
                level: 'Level: '
            },
            header: {
                back: '← Go Back',
                title: 'Energy & Changes',
                subtitle: 'Manage your cosmic investments and planetary-level subscriptions.'
            },
            stats: {
                totalLabel: 'TOTAL ENERGY INVESTED',
                trendLive: 'Updated in real time',
                trendBase: 'Initial base level',
                astralLabel: 'CURRENT ASTRAL LEVEL',
                nextAlign: 'Next ascent available',
                nextLabel: 'NEXT ALIGNMENT',
                daysLeft: 'DAYS REMAINING'
            },
            history: {
                title: 'Cosmic Interchange History',
                filter: 'FILTER',
                export: 'EXPORT',
                date: 'DATE',
                detail: 'DETAIL',
                amount: 'AMOUNT',
                action: 'ACTION',
                invoice: 'INVOICE',
                levelLabel: 'Level: ',
                footerPrefix: 'Showing ',
                footerSuffix: ' registered alignments'
            },
            empty: {
                title: 'Empty Stellar Vault',
                desc: 'You haven\'t claimed your stellar treasures yet. Start your first investment to unlock the secrets of the cosmic dimensions.',
                btn: 'START ASCENSION'
            }
        },
        checkout: {
            backBtn: '← BACK TO PLANS',
            title: 'COSMIC TERMINAL',
            subtitle: 'SECURE ASTRAL TRANSACTION',
            originLabel: 'ORIGIN_DETECTED',
            pickerTitle: 'SELECT YOUR DIMENSION',
            summaryTitle: 'ORDER SUMMARY',
            changeBtn: 'CHANGE',
            localValueLabel: 'VALUE IN YOUR CURRENCY:',
            tabs: {
                card: '💳 Astral Card',
                digital: '📱 Digital Wallet'
            },
            form: {
                holderLabel: 'NAVIGATOR AUTHORITY NAME',
                holderPlaceholder: 'ELARA VANCE',
                cardLabel: 'INTERSTELLAR SEQUENCE ID',
                cardPlaceholder: 'XXXX XXXX XXXX XXXX',
                expiryLabel: 'TEMPORAL LIMIT',
                expiryPlaceholder: 'MM/YY',
                cvvLabel: 'ACCESS ENCRYPTION',
                cvvPlaceholder: '***',
                syncBtn: '⚡ SYNCHRONIZE ASSETS',
                syncingBtn: 'SYNCHRONIZING WITH VESTA NETWORK...'
            },
            alt: {
                label: 'OR LINK VIA DIGITAL NODE',
                apple: 'Apple Pay is synchronizing with your Stellar ID.',
                wallet: 'Universal Wallet in docking phase.',
                crypto: 'Crypto Protocol Leya-7 activating.',
                appleLabel: 'APPLE PAY',
                walletLabel: 'WALLET',
                cryptoLabel: 'CRYPTO'
            },
            cardPreview: {
                holder: 'NAVIGATOR NAME'
            },
            alerts: {
                fillFields: 'Please complete the astral synchronization fields.',
                noPlan: 'No plan selected for synchronization.',
                success: 'Successful Synchronization! Your soul has ascended.'
            },
            currencies: {
                'CO': 'COLOMBIAN PESOS',
                'ES': 'EUROS',
                'EU': 'EUROS',
                'MX': 'MEXICAN PESOS',
                'AR': 'ARGENTINE PESOS',
                'CL': 'CHILEAN PESOS',
                'PE': 'SOLES',
                'US': 'DOLLARS'
            }
        },
        auth: {
            identity: 'COSMIC IDENTITY',
            subtitle: 'Choose your role to start your journey',
            chooseEssence: 'Choose Essence',
            access: 'STELLAR ACCESS',
            syncingAs: 'Synchronizing as',
            back: 'Go Back',
            tabs: {
                sync: 'Synchronize',
                transcend: 'Transcend (Register)'
            },
            roles: {
                traveler: { name: 'ASTRAL TRAVELER', label: 'TRAVELER', desc: 'Follow the imprint of numbers in your life.' },
                guide: { name: 'COSMIC GUIDE', label: 'GUIDE', desc: 'Interpret and share stellar wisdom.' }
            },
            fields: {
                identityLabel: 'CELESTIAL IDENTITY // ESSENCE',
                identityPlaceholder: 'cosmos@astral.mail',
                sigilLabel: 'VIBRATIONAL KEY // SIGIL',
                sigilPlaceholder: '••••••••',
                nameLabel: 'CELESTIAL NAME',
                namePlaceholder: 'Your name in the cosmos',
                emailLabel: 'LINK EMAIL',
                passLabel: 'NEW SIGIL',
                passPlaceholder: 'Secure password',
                dateLabel: 'ALIGNMENT DATE (BIRTH)'
            },
            options: {
                anchor: 'ANCHOR PRESENCE',
                forgot: 'FORGOT YOUR SIGIL?',
                others: 'OTHER DIMENSIONAL ACCESS',
                oracle: 'ORACLE SYNC',
                ether: 'ETHER LINK'
            },
            buttons: {
                login: 'LOG IN 🧭',
                register: 'CREATE STELLAR ACCOUNT ✦'
            },
            footer: {
                ethics: 'ZEN ETHICS',
                harmony: 'CSS HARMONY',
                void: 'VOID MAP',
                tagline: 'COSMIC NUMEROLOGY'
            },
            alerts: {
                fillFields: 'Please complete all fields.',
                success: 'Tuning complete! You can now log in.',
                ethicsMsg: 'Zen ethics rule our algorithm.',
                harmonyMsg: 'Visual harmony tuned.',
                voidMsg: 'Mapping the quantum void...'
            }
        },
        report: {
            overlay: {
                title: 'WEAVING YOUR DESTINY MAP',
                sync: 'Synchronizing akashic records'
            },
            header: {
                back: '← GO BACK',
                logo: 'ASTRAL PRESTIGE',
                download: 'DOWNLOAD PDF 📥'
            },
            hero: {
                tag: 'EXCLUSIVE PERSONAL REPORT',
                vibration: 'MASTER VIBRATION:'
            },
            pillars: {
                identity: { title: 'IDENTITY', value: 'Solar', desc: 'Dominant core of vitality.' },
                path: { title: 'PATH', value: 'Evolutionary', desc: 'Soul direction for this cycle.' },
                freq: { title: 'FREQUENCY', value: 'High', desc: 'Electromagnetic field level.' }
            },
            modules: {
                numerology: { title: 'Numerological Matrix', content: 'Your base numbers (3, 7, 11) indicate a period of karmic transmutation through knowledge.' },
                astrology: { title: 'Planetary Pulse', content: 'Jupiter in conjunction with your house of abundance suggests an unexpected flow of prosperity.' },
                aura: { title: 'Aura State', content: 'Your aura presents indigo tones with golden flashes, indicating an active ethereal protection.' }
            },
            certification: {
                desc: 'This report has been generated under the laws of sacred geometry and stellar resonance.',
                signature: 'Council of Astralis'
            },
            footer: '© 2024 Astralis Advanced Analytics. All cosmic rights reserved.',
            alerts: {
                preparing: 'Preparing data transmission for PDF...',
                encrypted: 'Your destiny is encrypted with Class S protocols.'
            },
            defaults: {
                name: 'ASTRAL TRAVELER',
                role: 'COSMIC SEEKER',
                summary: 'Your essence vibrates at a frequency of spiritual leadership and material construction. Current alignment favors the expansion of your network of influence.'
            }
        }
    }
}

export function useI18n() {
    const t = (key, params = {}) => {
        const keys = key.split('.')
        let result = translations[currentLanguage.value]
        for (const k of keys) {
            if (result && result[k]) result = result[k]
            else return key
        }

        // Simple placeholder replacement
        if (typeof result === 'string') {
            Object.keys(params).forEach(p => {
                result = result.replace(`{${p}}`, params[p])
            })
        }

        return result
    }

    const setLanguage = (lang) => {
        currentLanguage.value = lang
        localStorage.setItem('userLanguage', lang)
    }

    return {
        t,
        setLanguage,
        currentLanguage
    }
}
