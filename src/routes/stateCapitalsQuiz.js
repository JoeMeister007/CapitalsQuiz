import { statesList } from "./states.server";

export class StateCapitalsQuiz {
    constructor(serialized) {
        // Initialize the quiz state
        this.remainingStates = [...statesList];
        this.currentState = null;
        this.alreadyAnswered = false;
        this.correctAnswers = 0;
        this.totalQuestions = 0;
        this.answers = [];

        if (serialized) {
            const [currentState, alreadyAnswered, answerBlobs] = serialized.split('|');
            this.currentState = this.remainingStates.find(st => st.state === currentState);
            this.alreadyAnswered = alreadyAnswered === 'true';

            if (answerBlobs.trim() === '') {
                return; // No previous answers, don't break anything by parsing
            }

            const seenStates = new Set();
            seenStates.add(this.currentState);
            for (let answerBlob of answerBlobs.split('~')) {
                const [state, answer, correct] = answerBlob.split(':');
                seenStates.add(state);
                this.answers.push({
                    state,
                    answer,
                    correct: correct === 'true'
                });
                this.totalQuestions++;
                if (correct === 'true') {
                    this.correctAnswers++;
                }
            }
            this.remainingStates = this.remainingStates.filter(st => !seenStates.has(st.state));
        }
        else {
            this.getNextState();
        }
    }

    gameOver() {
        return this.alreadyAnswered && this.remainingStates.length === 0;
    }

    getNextState() {
        if (this.remainingStates.length === 0) {
            return;
        }
        const idx = Math.floor(Math.random() * this.remainingStates.length);
        this.currentState = this.remainingStates[idx];
        this.remainingStates.splice(idx, 1);
        this.alreadyAnswered = false;
    }

    guess(capital) {
        const correct = capital.trim().toLowerCase() === this.currentState.capital.toLowerCase();
        if (this.alreadyAnswered) {
            return correct;
        }

        this.answers.push({
            state: this.currentState.state,
            answer: capital,
            correct: correct
        });

        this.alreadyAnswered = true;

        this.totalQuestions++;
        if (correct) {
            this.correctAnswers++;
        }

        return correct;
    }

    revealAnswer() {
        // The user should have to guess first
        if (!this.alreadyAnswered) {
            return;
        }

        return this.currentState.capital;
    }

    toString() {
        const answerBlobs = this.answers.map(a => `${a.state}:${a.answer}:${a.correct}`);
        return `${this.currentState.state}|${this.alreadyAnswered}|${answerBlobs.join('~')}`;
    }
}