/* =========================================================
   KUSHEEN.OS — SYSTEM JAVASCRIPT
========================================================= */


/* =========================================================
   1. LIVE CLOCK
========================================================= */

const clock = document.getElementById("clock");

function updateClock() {
    const now = new Date();

    const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

    if (clock) {
        clock.textContent = time;
    }
}

updateClock();
setInterval(updateClock, 1000);


/* =========================================================
   2. CURRENT STATE
========================================================= */

const currentState = document.getElementById("currentState");
const stateButtons = document.querySelectorAll(".state-button");

let savedState =
    localStorage.getItem("kusheenState") || "BUILDING";

if (currentState) {
    currentState.textContent = savedState;
}

stateButtons.forEach(button => {

    if (button.dataset.state === savedState) {
        button.classList.add("active");
    } else {
        button.classList.remove("active");
    }

    button.addEventListener("click", () => {

        const state = button.dataset.state;

        savedState = state;

        if (currentState) {
            currentState.textContent = state;
        }

        localStorage.setItem(
            "kusheenState",
            state
        );

        stateButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        addConsoleMessage(
            `System state changed → ${state}`
        );
    });

});


/* =========================================================
   3. MOBILE SIDEBAR
========================================================= */

const sidebar = document.getElementById("sidebar");
const menuButton = document.getElementById("menuButton");

if (menuButton && sidebar) {

    menuButton.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });

}

document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", () => {

        if (window.innerWidth <= 800 && sidebar) {
            sidebar.classList.remove("open");
        }

    });

});


/* =========================================================
   4. ACTIVE NAVIGATION
========================================================= */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function updateActiveNavigation() {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop =
            section.getBoundingClientRect().top;

        if (sectionTop <= 180) {
            currentSection = section.id;
        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {
            link.classList.add("active");
        }

    });
}

window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
);

updateActiveNavigation();


/* =========================================================
   5. THEME SYSTEM
========================================================= */

const themeButton =
    document.getElementById("themeButton");

let lightMode =
    localStorage.getItem("kusheenTheme") === "light";

function applyTheme() {

    document.body.classList.toggle(
        "light",
        lightMode
    );

    if (themeButton) {

        themeButton.textContent =
            lightMode ? "☀" : "◐";

        themeButton.setAttribute(
            "aria-label",
            lightMode
                ? "Switch to dark theme"
                : "Switch to light theme"
        );
    }
}

applyTheme();

if (themeButton) {

    themeButton.addEventListener("click", () => {

        lightMode = !lightMode;

        localStorage.setItem(
            "kusheenTheme",
            lightMode ? "light" : "dark"
        );

        applyTheme();

        addConsoleMessage(
            lightMode
                ? "Light interface enabled."
                : "Dark interface enabled."
        );

    });

}


/* =========================================================
   6. GOAL TRACKER
========================================================= */

const goalButtons =
    document.querySelectorAll(".goal-check");

let savedGoals =
    JSON.parse(
        localStorage.getItem("kusheenGoals") || "[]"
    );

function updateGoals() {

    let completed = 0;

    goalButtons.forEach((button, index) => {

        if (savedGoals[index]) {

            button.classList.add("checked");
            completed++;

        } else {

            button.classList.remove("checked");

        }

    });

    const total = goalButtons.length;

    const percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );

    const percentageElement =
        document.getElementById(
            "goalPercentage"
        );

    const progressBar =
        document.getElementById(
            "goalProgressBar"
        );

    if (percentageElement) {
        percentageElement.textContent =
            `${percentage}%`;
    }

    if (progressBar) {
        progressBar.style.width =
            `${percentage}%`;
    }
}

goalButtons.forEach((button, index) => {

    button.addEventListener("click", () => {

        savedGoals[index] =
            !savedGoals[index];

        localStorage.setItem(
            "kusheenGoals",
            JSON.stringify(savedGoals)
        );

        updateGoals();

        addConsoleMessage(
            savedGoals[index]
                ? `Goal ${index + 1} completed.`
                : `Goal ${index + 1} reopened.`
        );

    });

});

updateGoals();


/* =========================================================
   7. FOCUS TIMER
========================================================= */

const timerDisplay =
    document.getElementById("timerDisplay");

const startTimer =
    document.getElementById("startTimer");

const pauseTimer =
    document.getElementById("pauseTimer");

const resetTimer =
    document.getElementById("resetTimer");

const timerProgress =
    document.getElementById("timerProgress");

const TOTAL_SECONDS = 25 * 60;

let remainingSeconds = TOTAL_SECONDS;
let timerInterval = null;

function updateTimerDisplay() {

    const minutes =
        Math.floor(
            remainingSeconds / 60
        );

    const seconds =
        remainingSeconds % 60;

    const formatted =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    if (timerDisplay) {
        timerDisplay.textContent =
            formatted;
    }

    if (timerProgress) {

        const circumference = 590;

        const progress =
            remainingSeconds /
            TOTAL_SECONDS;

        const offset =
            circumference -
            progress * circumference;

        timerProgress.style.strokeDashoffset =
            offset;
    }
}

function startFocusTimer() {

    if (timerInterval !== null) {
        return;
    }

    addConsoleMessage(
        "Focus session started."
    );

    timerInterval = setInterval(() => {

        if (remainingSeconds <= 0) {

            clearInterval(timerInterval);
            timerInterval = null;

            addConsoleMessage(
                "Focus session complete."
            );

            alert(
                "Focus session complete! 🔥"
            );

            remainingSeconds =
                TOTAL_SECONDS;

            updateTimerDisplay();

            return;
        }

        remainingSeconds--;

        updateTimerDisplay();

    }, 1000);
}

function pauseFocusTimer() {

    if (timerInterval !== null) {

        clearInterval(timerInterval);
        timerInterval = null;

        addConsoleMessage(
            "Focus session paused."
        );
    }
}

function resetFocusTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

    remainingSeconds =
        TOTAL_SECONDS;

    updateTimerDisplay();

    addConsoleMessage(
        "Focus timer reset."
    );
}

if (startTimer) {
    startTimer.addEventListener(
        "click",
        startFocusTimer
    );
}

if (pauseTimer) {
    pauseTimer.addEventListener(
        "click",
        pauseFocusTimer
    );
}

if (resetTimer) {
    resetTimer.addEventListener(
        "click",
        resetFocusTimer
    );
}

updateTimerDisplay();


/* =========================================================
   8. GITHUB API
========================================================= */

const githubUsername =
    "kusheenbhat05-wq";

async function loadGitHubData() {

    const repoCount =
        document.getElementById(
            "repoCount"
        );

    const followerCount =
        document.getElementById(
            "followerCount"
        );

    const followingCount =
        document.getElementById(
            "followingCount"
        );

    try {

        const response =
            await fetch(
                `https://api.github.com/users/${githubUsername}`
            );

        if (!response.ok) {
            throw new Error(
                "GitHub profile unavailable"
            );
        }

        const data =
            await response.json();

        if (repoCount) {
            repoCount.textContent =
                data.public_repos;
        }

        if (followerCount) {
            followerCount.textContent =
                data.followers;
        }

        if (followingCount) {
            followingCount.textContent =
                data.following;
        }

        addConsoleMessage(
            "GitHub profile synchronized."
        );

    } catch (error) {

        if (repoCount) {
            repoCount.textContent = "—";
        }

        if (followerCount) {
            followerCount.textContent = "—";
        }

        if (followingCount) {
            followingCount.textContent = "—";
        }

        addConsoleMessage(
            "GitHub synchronization unavailable."
        );
    }
}

loadGitHubData();


/* =========================================================
   9. PROJECT SYSTEM
========================================================= */

const projectCards =
    document.querySelectorAll(
        ".project-card"
    );

const projectCount =
    document.getElementById(
        "projectCount"
    );

if (projectCount) {

    projectCount.textContent =
        String(projectCards.length)
            .padStart(2, "0");

}


/* =========================================================
   PROJECT LINKS
========================================================= */

const projectLinks = {

    "DEVORA":
        "https://kusheenbhat05-wq.github.io/devora-developer-dashboard/",

    "KUSHEEN.OS":
        "https://kusheenbhat05-wq.github.io/kusheen-os/",

    "SignBridge":
        "https://kusheenbhat05-wq.github.io/signbridge/",

    "Smart Travel":
        "https://kusheenbhat05-wq.github.io/smart-travel/",

    "AI Resume Analyzer":
        "https://kusheenbhat05-wq.github.io/ai-resume-analyzer/"
};


/* =========================================================
   PROJECT CLICK HANDLER
========================================================= */

projectCards.forEach(card => {

    card.addEventListener("click", () => {

        const project =
            card.dataset.project;

        if (projectLinks[project]) {

            window.open(
                projectLinks[project],
                "_blank",
                "noopener,noreferrer"
            );

        } else {

            addConsoleMessage(
                `Project selected → ${project}`
            );

        }

    });

    card.setAttribute(
        "tabindex",
        "0"
    );

    card.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();
                card.click();

            }

        }
    );

});


/* =========================================================
   10. CONSOLE
========================================================= */

const consoleInput =
    document.getElementById(
        "consoleInput"
    );

const consoleOutput =
    document.getElementById(
        "consoleOutput"
    );

function addConsoleMessage(message) {

    if (!consoleOutput) {
        return;
    }

    const line =
        document.createElement("p");

    line.innerHTML =
        `<span style="color:#53e6ff">›</span> ${message}`;

    consoleOutput.appendChild(line);

    consoleOutput.scrollTop =
        consoleOutput.scrollHeight;
}

function runCommand(command) {

    const cleanCommand =
        command
            .trim()
            .toLowerCase();

    if (!cleanCommand) {
        return;
    }

    addConsoleMessage(
        `$ ${command}`
    );

    switch (cleanCommand) {

        case "help":

            addConsoleMessage(
                "Available: help, about, status, skills, projects, github, goals, clear"
            );

            break;


        case "about":

            addConsoleMessage(
                "Kusheen Bhat — B.Tech CSE developer building web experiences and learning software engineering."
            );

            break;


        case "status":

            addConsoleMessage(
                `Current state: ${currentState ? currentState.textContent : savedState}`
            );

            break;


        case "skills":

            addConsoleMessage(
                "HTML, CSS, JavaScript, Java, SQL, Git & GitHub."
            );

            break;


        case "projects":

            addConsoleMessage(
                `${projectCards.length} projects registered in KUSHEEN.OS.`
            );

            break;


        case "github":

            addConsoleMessage(
                `GitHub: github.com/${githubUsername}`
            );

            break;


        case "goals": {

            const completedGoals =
                savedGoals.filter(
                    Boolean
                ).length;

            addConsoleMessage(
                `${completedGoals}/${goalButtons.length} goals completed.`
            );

            break;
        }


        case "clear":

            consoleOutput.innerHTML = "";

            break;


        default:

            addConsoleMessage(
                `Unknown command: "${command}". Type "help".`
            );

    }
}

if (consoleInput) {

    consoleInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                runCommand(
                    consoleInput.value
                );

                consoleInput.value = "";
            }

        }
    );
}


/* =========================================================
   11. KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /* Press / to focus console */

        if (
            event.key === "/" &&
            document.activeElement !== consoleInput
        ) {

            event.preventDefault();

            if (consoleInput) {
                consoleInput.focus();
            }
        }


        /* Escape closes mobile menu */

        if (
            event.key === "Escape" &&
            sidebar
        ) {

            sidebar.classList.remove(
                "open"
            );
        }

    }
);


/* =========================================================
   12. INITIAL SYSTEM MESSAGES
========================================================= */

setTimeout(() => {

    addConsoleMessage(
        "All local systems operational."
    );

}, 800);


setTimeout(() => {

    addConsoleMessage(
        "Digital twin ready."
    );

}, 1500);
