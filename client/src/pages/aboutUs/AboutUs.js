import React from 'react'

function AboutUs() {
  return (
    <div>
      <div className="about-container">
      <div className="about-card">
        <h1 className="about-title">About Share</h1>
        <p className="about-subtitle">
          Share anything. Discover everything.
        </p>

        <div className="about-section">
          <h2>🌍 What is this app?</h2>
          <p>
            <b>Share</b> is a social platform built for openness, simplicity, and
            expression. 
            <p>It’s a place where people can post anything — thoughts,
            ideas, stories, questions, or moments — and others can see, explore,
            and connect through content.</p>
          </p>
        </div>

        <div className="about-section">
          <h2>💬 Our Vision</h2>
          <p>
            We want Share to be a digital space where authenticity matters more
            than popularity. No pressure, no filters — just real people sharing
            real thoughts.
          </p>
        </div>

        <div className="about-section">
          <h2>🤝 How it works</h2>
          <ul>
            <li>Create an account</li>
            <li>Post anything you want</li>
            <li>Explore posts from others</li>
            <li>Like and engage with content</li>
          </ul>
        </div>

        <div className="about-footer">
          <span>
            Built with ❤️ using Node.js, React, and PostgreSQL
          </span>
        </div>
      </div>
    </div>
    </div>
  )
}

export default AboutUs
