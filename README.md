# JarVista - Personal AI Assistants Application

## Overview

JarVista is envisioned as a personal AI assistants application designed to provide users with intelligent assistance and enhanced productivity. Built with modern web technologies, it aims to offer a seamless and intuitive experience for managing various tasks through AI-powered functionalities.

## Features

While specific features are not detailed in the provided snippets, a "Personal AI Assistants Application" typically includes:

* **Intelligent Task Management:** Assistance with organizing and prioritizing tasks.
* **Content Generation/Summarization:** Leveraging AI for text-based operations.
* **Information Retrieval:** Quick access to relevant information.
* **Personalized Interactions:** Adapting to user preferences and habits.
* **Responsive User Interface:** Optimized for both web and mobile experiences.
* **Secure Authentication:** User login and data protection.

## Technologies Used

JarVista leverages a robust stack of modern web development technologies:

* **Frontend Framework:** [Next.js](https://nextjs.org/docs) (React Framework for production)
* **UI Library:** [React](https://react.dev/)
* **Component Library:** [shadcn/ui](https://ui.shadcn.com/) (Built on Tailwind CSS and Radix UI)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/docs) (A utility-first CSS framework)
* **Authentication:** [Google Identity Platform](https://developers.google.com/identity)
* **Backend:** [Convex](https://docs.convex.dev) (Realtime backend as a service)
* **AI Integration:** [Eden AI API](https://www.edenai.co/docs) (For various AI functionalities)

## Installation and Setup (Conceptual)

To set up JarVista locally, you would typically follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone github.com/vikascc28/jarvista
    cd jarvista
    ```
    *(Replace `github.com/vikascc28/jarvista` with the actual GitHub repository URL)*

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your API keys and configuration details for services like Google Identity Platform, Convex, and Eden AI.
    ```
    # Example .env content (actual variables may vary)
    NEXT_PUBLIC_CONVEX_URL=your_convex_url
    NEXT_PUBLIC_EDEN_AI_API_KEY=your_eden_ai_api_key
    # Add other necessary environment variables for Google Identity Platform etc.
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

Once the application is running, you can access it via your web browser. Users will likely need to sign in using their Google account to access personalized AI assistant features. The interface will guide users through various functionalities, leveraging the integrated AI capabilities.

## Future Enhancements

As outlined in the project report, future enhancements for JarVista include:

* **SaaS Model Implementation:** Transitioning to a Software as a Service (SaaS) model, potentially integrating with platforms like Eden AI, to offer tiered subscription plans with flexible access to extended features, additional AI usage, and higher performance capabilities.
* **Mobile App UI Streamlining:** Enhancing the user interface (UI) of the mobile application for smaller screens, focusing on simplicity and ease of use to provide a more intuitive and engaging experience, ensuring a seamless extension of the web platform.

## References

The project's development has been guided by the following documentation and resources:

**1. Frameworks and Libraries:**

* Next.js Documentation. (2025). Vercel. Retrieved from [https://nextjs.org/docs](https://nextjs.org/docs)
* React Documentation. (2025). Meta. Retrieved from [https://react.dev/](https://react.dev/)
* shadcn/ui Documentation. (2025). shadcn. Retrieved from [https://ui.shadcn.com/](https://ui.shadcn.com/)
* Tailwind CSS Documentation. (2025). Tailwind Labs. Retrieved from [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

**2. Authentication:**

* Google Identity Platform Documentation. (2025). Google Developers. Retrieved from [https://developers.google.com/identity](https://developers.google.com/identity)

**3. Backend and APIs:**

* Convex Documentation. (2025). Convex. Retrieved from [https://docs.convex.dev](https://docs.convex.dev)
* Eden AI API Documentation. (2025). Eden AI. Retrieved from [https://www.edenai.co/docs](https://www.edenai.co/docs)

**4. Software and Tools:**

* Visual Studio Code Documentation. (2025). Microsoft. Retrieved from [https://code.visualstudio.com/docs](https://code.visualstudio.com/docs)
* GitHub Documentation. (2025). Git SCM. Retrieved from [https://github.com/en](https://github.com/en)

## Contributors

* Shashank Shekhar 
* Abhishek Singh
* Vikas Chaurasia

*(Under the guidance of Dr. Sukhpreet Singh, Assistant Professor, Department of CSE, SLIET Longowal)*
