import python from "./assets/python.webp";
import java from "./assets/java.png";
import fullstack from "./assets/fullstack.png";
import ai from "./assets/ai.png";
import cloud from "./assets/cloud.png";
import datascience from "./assets/datascience.png";
import cpp from "./assets/cpp.png";

const coursesData = [
    {
        id: "python-certification",
        title: "Python",
        department: "Software Development",
        duration: "60 Hours",
        rating: 5,
        ratingCount: 30,
        image: python,
        iconText: "🐍",
        iconColor: "#4ADE80",
        modeText: "In-center | Online | Hybrid | Full/Part time",
        placementText: "60 Hours | Placements",
        categories: ["DSA / Placements", "Development", "Prog Lang"],
        description: "Python is a powerful, versatile programming language that is easy to learn and widely used in web development, data science, AI, and more. This course takes you from basics to advanced concepts, ensuring you are industry-ready.",
        objective: "Learners will master Python syntax, data structures, and object-oriented programming. By the end, they will be able to build robust applications and automate tasks efficiently.",
        features: {
            duration: "60 Hours",
            learningMode: "In-Center And Online",
            practical: "Hands-On Experience",
            experts: "Industry Experts"
        },
        keyTopics: {
            column1Title: "Core Python",
            column1: ["Syntax & Basics", "Data Structures", "OOPs Concepts", "Exception Handling"],
            column2Title: "Advanced Python",
            column2: ["File Handling", "Database Connectivity", "Libraries (NumPy, Pandas)", "Web Scraping"]
        },
        scope: {
            description: "Python developers are in high demand across various industries including Finance, Healthcare, and Tech.",
            jobRoles: ["Python Developer", "Data Analyst", "Backend Engineer", "Automation Tester"],
            suitableFor: ["Students", "IT Professionals", "Data Science Enthusiasts"]
        },
        realTimeProjects: [
            "Data Analysis Dashboard",
            "Automated Email Sender",
            "E-commerce Web Scraper"
        ]
    },
    {
        id: "java-certification",
        title: "JAVA",
        department: "Software Development",
        duration: "60 Hours",
        rating: 5,
        ratingCount: 30,
        image: java,
        iconText: "☕",
        iconColor: "#F97316",
        modeText: "In-center | Online | Hybrid | Full/Part time",
        placementText: "60 Hours | Placements",
        categories: ["Development", "ML and Data Science", "Prog Lang", "GATE"],
        description: "Java is a class-based, object-oriented programming language designed to have as few implementation dependencies as possible. It is a general-purpose programming language intended to let application developers write once, run anywhere (WORA).",
        objective: "Understand object-oriented programming concepts, Java syntax, libraries, and frameworks. Build scalable and secure enterprise-level applications.",
        features: {
            duration: "60 Hours",
            learningMode: "In-Center And Online",
            practical: "Real-world Projects",
            experts: "Certified Professionals"
        },
        keyTopics: {
            column1Title: "Core Java",
            column1: ["Java Basics", "OOPs", "Collections Framework", "Multithreading"],
            column2Title: "Advanced Java",
            column2: ["JDBC", "Servlets & JSP", "Spring Framework", "Hibernate"]
        },
        scope: {
            description: "Java is the backbone of many large-scale enterprise systems.",
            jobRoles: ["Java Developer", "Software Engineer", "Backend Developer", "Android Developer"],
            suitableFor: ["CS Graduates", "Backend Developers", "Mobile App Developers"]
        },
        realTimeProjects: [
            "Banking Management System",
            "Library Management System",
            "Employee Payroll System"
        ]
    },
    {
        id: "mean-stack-certification",
        title: "Full Stack MEAN/MERN",
        department: "Web Development",
        duration: "60 Hours",
        rating: 5,
        ratingCount: 30,
        image: fullstack,
        iconText: "🌐",
        iconColor: "#3B82F6",
        modeText: "In-center | Online | Hybrid | Full/Part time",
        placementText: "60 Hours | Placements",
        categories: ["ML and Data Science", "Exam Preparation", "Development"],
        description: "MEAN / MERN stack: Full-stack development using MEAN (MongoDB, Express, Angular, Node.js) or MERN (MongoDB, Express, React, Node.js) stack allows developers to build end-to-end web applications. This skillset is highly valued in the software industry.",
        objective: "Learners will be equipped with the knowledge and skills needed to design and develop modern web applications using the MEAN or MERN stack. Learners will be able to build and deploy end-to-end applications.",
        features: {
            duration: "60 Hours",
            learningMode: "In-Center And Online",
            practical: "Hands-On Experience",
            experts: "Industry Experts"
        },
        keyTopics: {
            column1Title: "Back End",
            column1: ["Express.js", "GitHub", "Heroku", "Node.js", "Restful API"],
            column2Title: "Front End",
            column2: ["Angular", "Bootstrap", "CSS3", "Database", "HTML", "JavaScript", "jQuery", "JSON", "MongoDB"]
        },
        scope: {
            description: "The Full Stack Development course using MEAN/MERN stack has a wide range of career opportunities. With the growing demand for web development skills, learners can expect to work as Full Stack Developers, Web Developers, Software Engineers, and more.",
            suitableFor: ["Aspiring web developers", "Experienced developers who want to add MEAN/MERN stack", "Students interested in web development", "Entrepreneurs who want to build web applications", "Anyone interested in building robust and scalable web applications"],
            jobRoles: ["Back-end Developer", "Front-end Developer", "Full Stack Developer", "JavaScript Developer", "Software Engineer", "Web Developer"]
        },
        realTimeProjects: [
            "Ecommerce Shopping cart",
            "Online Examination portal",
            "CRUD Operation with Passport authentication",
            "Youtube Streaming Website"
        ]
    },
    {
        id: "artificial-intelligence",
        title: "Artificial Intelligence",
        department: "Special Programs",
        duration: "70 Hours",
        rating: 5,
        ratingCount: 30,
        image: ai,
        iconText: "🤖",
        iconColor: "#A855F7",
        modeText: "In-center | Online | Hybrid",
        placementText: "70 Hours | Placements",
        categories: ["ML and Data Science", "Development"],
        description: "Explore the depths of Artificial Intelligence, from Machine Learning to Deep Learning and Neural Networks. Master the technologies shaping the future.",
        objective: "Understand AI concepts, implement ML algorithms, and build intelligent systems using Python and TensorFlow.",
        features: {
            duration: "70 Hours",
            learningMode: "Hybrid Learning",
            practical: "AI Models",
            experts: "AI Researchers"
        },
        keyTopics: {
            column1Title: "AI Foundations",
            column1: ["Intro to AI", "Python for AI", "Supervised Learning", "Unsupervised Learning"],
            column2Title: "Advanced AI",
            column2: ["Neural Networks", "Deep Learning", "NLP", "Computer Vision"]
        },
        scope: {
            description: "AI is revolutionizing every industry.",
            jobRoles: ["AI Engineer", "ML Engineer", "Data Scientist", "Research Scientist"],
            suitableFor: ["Data Enthusiasts", "Developers", "Mathematicians"]
        },
        realTimeProjects: [
            "Chatbot Development",
            "Image Recognition System",
            "Predictive Analytics Model"
        ]
    },
    {
        id: "cloud-computing",
        title: "Cloud Computing",
        department: "Cloud / DevOps",
        duration: "50 Hours",
        rating: 5,
        ratingCount: 30,
        image: cloud,
        iconText: "☁️",
        iconColor: "#6366F1",
        modeText: "In-center | Online | Hybrid | Full/Part time",
        placementText: "50 Hours | Placements",
        categories: ["Cloud / DevOps", "Development"],
        description: "Master Cloud Computing concepts with AWS, Azure, or Google Cloud. Learn how to deploy, manage, and scale applications in the cloud environment.",
        objective: "Gain hands-on experience with cloud infrastructure, services, and security. Prepare for cloud certification exams and real-world deployment scenarios.",
        features: {
            duration: "50 Hours",
            learningMode: "Online & Offline",
            practical: "Cloud Labs",
            experts: "Cloud Architects"
        },
        keyTopics: {
            column1Title: "Cloud Basics",
            column1: ["Virtualization", "AWS EC2", "S3 Storage", "IAM Roles"],
            column2Title: "Advanced Cloud",
            column2: ["VPC Networking", "Lambda Functions", "Auto Scaling", "Load Balancing"]
        },
        scope: {
            description: "Cloud computing is essential for modern IT infrastructure.",
            jobRoles: ["Cloud Engineer", "DevOps Engineer", "Solutions Architect", "System Administrator"],
            suitableFor: ["IT Administrators", "Developers", "Network Engineers"]
        },
        realTimeProjects: [
            "Deploying a Multi-Tier Web App",
            "Serverless Image Processing",
            "Secure File Storage System"
        ]
    },
    {
        id: "data-science",
        title: "Data Science",
        department: "Data Analysis",
        duration: "80 Hours",
        rating: 5,
        ratingCount: 30,
        image: datascience,
        iconText: "📊",
        iconColor: "#EC4899",
        modeText: "In-center | Online | Hybrid | Full/Part time",
        placementText: "80 Hours | Placements",
        categories: ["ML and Data Science", "Exam Preparation", "GATE"],
        description: "Data Science is an interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge and insights from noisy, structured and unstructured data.",
        objective: "Learn data analysis, statistical modeling, machine learning algorithms, and data visualization techniques using Python and R.",
        features: {
            duration: "80 Hours",
            learningMode: "Hybrid Learning",
            practical: "Live Data Projects",
            experts: "Data Scientists"
        },
        keyTopics: {
            column1Title: "Statistics & Python",
            column1: ["Probability", "Hypothesis Testing", "Pandas & Matplotlib", "Exploratory Data Analysis"],
            column2Title: "Machine Learning",
            column2: ["Regression", "Classification", "Clustering", "Deep Learning Basics"]
        },
        scope: {
            description: "Data is the new oil, and data scientists are the refiners.",
            jobRoles: ["Data Scientist", "Data Analyst", "Machine Learning Engineer", "Business Analyst"],
            suitableFor: ["Statisticians", "Developers", "Business Professionals"]
        },
        realTimeProjects: [
            "House Price Prediction",
            "Customer Churn Analysis",
            "Credit Card Fraud Detection"
        ]
    },
    {
        id: "cpp-programming",
        title: "C++ Programming",
        department: "Programming",
        duration: "45 Hours",
        rating: 5,
        ratingCount: 30,
        image: cpp,
        iconText: "💻",
        iconColor: "#e31e24",
        modeText: "In-center | Online | Hybrid | Full/Part time",
        placementText: "45 Hours | Placements",
        categories: ["Prog Lang", "DSA / Placements", "GATE"],
        description: "C++ is a high-performance general-purpose programming language. It is widely used for developing system software, game engines, and high-performance applications.",
        objective: "Master C++ syntax, memory management, pointers, and object-oriented concepts. Solve complex algorithmic problems efficiently.",
        features: {
            duration: "45 Hours",
            learningMode: "In-Center And Online",
            practical: "Coding Drills",
            experts: "Senior Developers"
        },
        keyTopics: {
            column1Title: "C++ Basics",
            column1: ["Variables & Loops", "Functions", "Pointers", "Arrays"],
            column2Title: "OOP & STL",
            column2: ["Classes & Objects", "Inheritance", "Polymorphism", "STL Containers"]
        },
        scope: {
            description: "C++ is crucial for performance-critical applications.",
            jobRoles: ["System Software Engineer", "Game Developer", "Embedded Systems Engineer", "Financial Trading Systems Dev"],
            suitableFor: ["CS Students", "Game Dev Enthusiasts", "System Programmers"]
        },
        realTimeProjects: [
            "Library Management System",
            "Bank Management System",
            "Casino Number Guessing Game"
        ]
    },
    {
        id: "digital-marketing",
        title: "Digital Marketing",
        department: "Marketing",
        duration: "40 Hours",
        rating: 5,
        ratingCount: 30,
        iconText: "📢",
        iconColor: "#EF4444",
        modeText: "In-center | Online | Hybrid | Full/Part time",
        placementText: "40 Hours | Placements",
        categories: ["Marketing", "Development"],
        description: "Learn digital marketing strategies including SEO, SEM, Social Media Marketing, Content Marketing, and Email Marketing to grow businesses online.",
        objective: "Understand how to create effective digital marketing campaigns, analyze performance metrics, and optimize for better ROI.",
        features: {
            duration: "40 Hours",
            learningMode: "Online & Workshop",
            practical: "Live Campaigns",
            experts: "Marketing Gurus"
        },
        keyTopics: {
            column1Title: "SEO & Content",
            column1: ["On-Page SEO", "Off-Page SEO", "Keyword Research", "Content Strategy"],
            column2Title: "Ads & Analytics",
            column2: ["Google Ads", "Facebook Ads", "Google Analytics", "Email Automation"]
        },
        scope: {
            description: "Digital presence is mandatory for every business today.",
            jobRoles: ["Digital Marketing Manager", "SEO Specialist", "Social Media Manager", "Content Marketer"],
            suitableFor: ["Marketing Students", "Business Owners", "Freelancers"]
        },
        realTimeProjects: [
            "Website SEO Audit",
            "Social Media Campaign Launch",
            "Email Marketing Sequence"
        ]
    },

];

export default coursesData;


