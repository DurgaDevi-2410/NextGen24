import React, { useRef, useState, useEffect } from "react";
import "./LandingPage.css";
import penImg from "../assets/pen_new.png";
import gradIcon from "../assets/grad_cap.png";
import trophyIcon from "../assets/trophy.png";
import handshakeIcon from "../assets/handshake.png";



import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function LandingPage() {
  const containerRef = useRef(null);
  const penRef = useRef(null);


  useGSAP(() => {
    // Master timeline for entrance animation
    const masterTl = gsap.timeline();

    // Step 1: Pen enters from bottom to center
    masterTl.fromTo(penRef.current,
      {
        y: "100vh", // Start from bottom of screen
        opacity: 0,
        rotation: 45,
        scale: 0.8
      },
      {
        y: 0, // Move to center
        opacity: 1,
        rotation: 0,
        scale: 1,
        duration: 2,
        ease: "power3.out"
      }
    );

    // Step 2: Pen pauses briefly at center
    masterTl.to(penRef.current, {
      duration: 0.5
    });

    // Step 3: Pen moves to its final position (right side)
    masterTl.to(penRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 1,
      ease: "power2.inOut"
    });

    // Step 4: Reveal Content
    masterTl.to(".hero-left", {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out"
    }, "-=0.8");

    masterTl.from(".hero-left > *", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power4.out"
    }, "-=0.8");



    // Parallax effect
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      gsap.to(penRef.current, {
        x,
        y,
        duration: 1,
        ease: "power2.out"
      });
    };

    masterTl.eventCallback("onComplete", () => {
      window.addEventListener("mousemove", handleMouseMove);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, { scope: containerRef });



  return (
    <div className="landing-container" ref={containerRef}>
      <div className="hero-section">
        <div className="main-content">

          <div className="hero-left">
            <h1 className="hero-title">
              Learn Website<br />
              <span className="highlight">Development</span>
            </h1>

            <p className="hero-description">
              Master Full Stack Development, UI/UX Design, and Python with our industry-ready curriculum.
              Get hands-on experience and land your dream job in tech.
            </p>

            <div className="action-row">
              <button className="btn-join">Join Now</button>
              <div className="watch-demo">
                <div className="play-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span>Watch Demo...</span>
              </div>
            </div>

            <div className="search-bar-container">
              <div className="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input type="text" placeholder="Find Course..." className="search-input" />
              <button className="btn-search">Search</button>
            </div>

            <div className="trust-indicators">
              <div className="trust-item">
                <span>⭐</span> 4.9 Rating
              </div>
              <div className="trust-item">
                <span>👨‍🎓</span> 50K+ Students
              </div>
              <div className="trust-item">
                <span>💼</span> Job Ready Curriculum
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="pen-container" ref={penRef}>
              <img src={penImg} alt="Pen" className="hero-pen" />
              <div className="pen-tip-glow"></div>
            </div>
          </div>

        </div>



      </div>
    </div>
  );
}