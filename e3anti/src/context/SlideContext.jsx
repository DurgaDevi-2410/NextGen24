import React, { createContext, useState, useEffect } from 'react';

export const SlideContext = createContext();

const defaultSlides = [
    {
        title: 'IRON MAN',
        desc: `A visionary mind wrapped in cutting-edge armor. Powered by intellect, not superpowers. Tony Stark builds solutions where others see limits. Innovation, sacrifice, and responsibility define him. A hero forged by choice, not destiny.`,
        bg: 'linear-gradient(135deg, #e31e24 0%, #c4191f 100%)',
        image: './images/a1.png',
        offsetX: 0,
    },
    {
        title: 'HARISH',
        desc: `Born a god, tempered by humility. Wielder of Mjolnir and protector of realms. Strength guided by honor and loyalty. Thunder follows his command. A warrior learning what it truly means to be worthy.`,
        bg: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
        image: './images/hari_professional-removebg-preview.png',
        offsetX: 60,
    },
    {
        title: 'SPIDER MAN',
        desc: `A friendly neighborhood hero with a heavy heart. Gifted with power, bound by responsibility. Balances courage, doubt, and sacrifice. Every fall teaches resilience. Proof that even ordinary lives can become extraordinary.`,
        bg: 'linear-gradient(135deg, #e31e24 20%, #ffffff 100%)',
        image: './images/a3.png',
        offsetX: 210,
    },
    {
        title: 'CAPTAIN AMERICA',
        desc: `A symbol of hope in the face of chaos. Strength rooted in unwavering morals. Leads not by force, but by example. Loyal to truth, justice, and humanity. A soldier who never stops standing for what’s right.`,
        bg: 'linear-gradient(135deg, #ffffff 0%, #e31e24 100%)',
        image: './images/a4.png',
        offsetX: 250,
    },
];

export const SlideProvider = ({ children }) => {
    const [slides, setSlides] = useState(() => {
        const savedSlides = localStorage.getItem('heroSlides');
        return savedSlides ? JSON.parse(savedSlides) : defaultSlides;
    });

    useEffect(() => {
        try {
            localStorage.setItem('heroSlides', JSON.stringify(slides));
        } catch (error) {
            console.error("Failed to save slides to localStorage:", error);
            alert("Storage limit reached! Some data may not be saved. Try deleting older items.");
        }
    }, [slides]);

    const addSlide = (slide) => {
        setSlides((prev) => [...prev, slide]);
    };

    const removeSlide = (index) => {
        setSlides((prev) => prev.filter((_, i) => i !== index));
    };

    const updateSlide = (index, updatedSlide) => {
        setSlides((prev) => {
            const newSlides = [...prev];
            newSlides[index] = updatedSlide;
            return newSlides;
        })
    }

    const resetSlides = () => {
        setSlides(defaultSlides);
    }

    return (
        <SlideContext.Provider value={{ slides, addSlide, removeSlide, updateSlide, resetSlides }}>
            {children}
        </SlideContext.Provider>
    );
};
