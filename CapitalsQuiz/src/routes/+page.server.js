import { form } from '$app/server';
import { StateCapitalsQuiz } from './stateCapitalsQuiz.js';

export const load = ({ cookies }) => {
    const serializedQuiz = cookies.get('stateCapitalsQuiz');    
    let stateCapitalsQuiz = new StateCapitalsQuiz(serializedQuiz);

    // Because of the randomness we initialize the quiz this way so the first state doesn't change on you
    if (!serializedQuiz) {
        cookies.set('stateCapitalsQuiz', stateCapitalsQuiz.toString(), {path: '/'});
    }

    return {
        answers: stateCapitalsQuiz.answers,
        currentState: stateCapitalsQuiz.currentState.state,
        alreadyAnswered: stateCapitalsQuiz.alreadyAnswered,
        correctAnswers: stateCapitalsQuiz.correctAnswers,
        totalQuestions: stateCapitalsQuiz.totalQuestions,
        gameOver: stateCapitalsQuiz.gameOver()
    }
}

export const actions = {
    submit: async ({ request, cookies }) => {
        const stateCapitalsQuiz = new StateCapitalsQuiz(cookies.get('stateCapitalsQuiz'));

        const formData = await request.formData();
        const capital = (formData.get('capital') ?? '').trim();

        const alreadyAnswered = stateCapitalsQuiz.alreadyAnswered;

        const correct = stateCapitalsQuiz.guess(capital);

        if (!alreadyAnswered) {
            cookies.set('stateCapitalsQuiz', stateCapitalsQuiz.toString(), {path: '/'});
        }

        return {
            capital: correct ? stateCapitalsQuiz.revealAnswer() : capital,
            correct: correct,
        }
    },

    next: async ({cookies}) => {
        const stateCapitalsQuiz = new StateCapitalsQuiz(cookies.get('stateCapitalsQuiz'));

        const updatedQuiz = !stateCapitalsQuiz.gameOver();

        if (updatedQuiz) {
            stateCapitalsQuiz.getNextState();
            cookies.set('stateCapitalsQuiz', stateCapitalsQuiz.toString(), {path: '/'});
        }
    },

    reveal: async ({cookies}) => {
        const stateCapitalsQuiz = new StateCapitalsQuiz(cookies.get('stateCapitalsQuiz'));

        

        return {
            capital: stateCapitalsQuiz.revealAnswer(),
            correct: false,
            revealed: true
        }
    },

    restart: async ({cookies}) => {
        cookies.delete('stateCapitalsQuiz', {path: '/'});
    }
}