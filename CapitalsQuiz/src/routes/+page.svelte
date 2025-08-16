<script>
    const { data, form } = $props();
    import { enhance } from '$app/forms';
  import { tick } from 'svelte';

    let capitalInput;
    let nextStateButton = $state(null)
</script>

<div class="container-fluid">
    <h1 class="">Capitals Quiz</h1>
    <p class="mb-5">Enter in the capital for each state. How well do 
        you know your capitals?
    </p>
    <div class="card quiz-card mx-auto p-4">
        <form method="POST" action="?/submit" use:enhance={() => {
            return async ({update}) => {
                await update();
                if ((form?.correct || form?.revealed) && nextStateButton) {
                    nextStateButton.focus();
                }
                else if (form?.correct === false && capitalInput) {
                    capitalInput.focus();
                    capitalInput.setSelectionRange(0, capitalInput.value.length);
                }
            };
        }}>
            <div class="card-body">
                <div class="text-end">{data.correctAnswers}/{data.totalQuestions}</div>
                <div class="card-title h2 text-center mb-3">{data.currentState}</div>
                <div class="card-text">
                    <input type="hidden" name="state" value={data.currentState}/>
                    <label for="capital" class="form-label" required>Capital</label>
                    <input type="text" 
                        name="capital" id="capital" 
                        class="form-control mb-3"
                        value={form?.capital || ''}
                        disabled={form?.correct || form?.revealed}
                        autocomplete="off"
                        required={form == undefined}
                        bind:this={capitalInput}
                    />
                    <button type="submit" 
                        class="btn btn-primary"
                        disabled={form?.correct || form?.revealed}
                    >
                        Submit
                    </button>
                    {#if form?.correct === false && form?.revealed !== true}
                        <button
                            class="btn btn-outline-secondary ms-1"
                            disabled={form?.correct}
                            formaction="?/reveal"
                        >
                            Reveal
                        </button>
                    {/if}
                </div>
            </div>
            {#if form?.correct}
                <div class="text-success">Correct!</div>
            {:else if form?.correct === false}
                <div class="text-danger">Incorrect!</div>
            {:else if form?.error}
                <div class="text-danger">{form.error}</div>
            {/if}
            {#if data.alreadyAnswered}
                <div class="d-flex justify-content-end">
                    <button class="btn {form?.correct ? 'btn-success' : 'btn-danger'}" 
                        formaction={data.gameOver ? '?/restart' : '?/next'} bind:this={nextStateButton}
                    >
                        Next
                    </button>
                </div>        
            {/if}
        </form>
    </div>
</div>

<style>
    .quiz-card {
        max-width: 40rem;
    }
</style>
