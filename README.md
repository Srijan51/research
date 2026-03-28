# Auto Research Platform

## Overview
The **Auto Research Platform** is an AI-powered, full-stack application designed to automate complex research workflows, synthesize information, and generate comprehensive reports. It combines a robust, high-performance backend with a dynamic, user-centric frontend to guide users through the entire research lifecycle—from initial strategy formulation to deep-dive exploration and memory retention.

## Main Aspects of the Project

### 1. Intelligent AI Service Layer (Backend)
Built with **FastAPI**, **LangChain**, and **OpenAI**, the backend features a modular architecture that manages the entire intelligence pipeline:
- **Agent Processing**: Manages AI agents performing automated research tasks.
- **Research Strategy**: Dynamically formulates and adjusts research strategies based on user queries.
- **Deep Dive & Output Generation**: Synthesizes gathered data into coherent, detailed reports.
- **Memory Management**: Retains context and critical information across user sessions.

### 2. Robust API Infrastructure
The backend is designed for production readiness with standard enterprise features:
- **Global Error Handling & Middleware**: Ensures stable execution with centralized exception handlers.
- **Request Tracing**: Built-in middleware for request timing and tracing (via UUIDs) to ensure observability.
- **Standardized Responses**: Uses Pydantic schemas for consistent JSON API responses.

### 3. Comprehensive Frontend User Flow
The frontend is structured to provide clear visualizations of the AI's thought processes and actions, featuring distinct UI sections:
- **Hero/Landing**: The entry point for user queries.
- **Process & Strategy Frames**: Visualizes the AI's step-by-step methodology.
- **Results Dashboard & Deep Dive**: Interactive interfaces for users to explore summarized results and trigger deeper investigations.
- **Memory Section**: Allows users to view and manage past research contexts.

## Tech Stack
- **Backend**: Python, FastAPI, Uvicorn, Pydantic, LangChain, OpenAI
- **Frontend**: High-fidelity UI components structured for video/animation-driven user experiences.

## Getting Started
Navigate to the `backend/backend api` directory, install the Python dependencies via `requirements.txt`, and configure the `.env` file based on `.env.example` to start the backend server.