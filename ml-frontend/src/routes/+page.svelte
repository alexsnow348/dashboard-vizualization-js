<script lang="ts">
  import { fly } from "svelte/transition";
  import Header from "./Header.svelte";

  let formState = $state({
    answers: {},
    step: 0,
    error: "",
  });

  $inspect(formState);
  const QUESTIONS = [
    {
      question: "Name",
      id: "name",
      type: "text",
    },
    {
      question: "Birthday",
      id: "birthday",
      type: "date",
    },
  ];

  function nextStep(id: string) {
    if (formState.answers[id]) {
      formState.step += 1;
      formState.error = "";
    } else {
      formState.error = "Name is required";
    }
  }

  $effect(() => {
    console.log("Form state changed", formState.step);
    return () => {
      console.log("Form state cleanup", formState.step);
    };
  });
</script>

{#snippet formStep({
  question,
  type,
  id,
}: {
  question: string;
  type: string;
  id: string;
})}
  <article>
    <div>
      <label for={id}>{question}</label>
      <input {type} {id} bind:value={formState.answers[id]} />
    </div>
    <button onclick={() => nextStep(id)}>Next</button>
  </article>
{/snippet}

<Header name={formState.answers.name}></Header>
<main lang="ts">
  {#if formState.step >= QUESTIONS.length}
    <h1>Thank you for submitting the form</h1>
  {/if}
  <h1>Step: {formState.step}</h1>
  {#each QUESTIONS as question, index (question.id)}
    {#if formState.step === index}
      <div
        in:fly={{ x: 100, y: 0, duration: 200, opacity: 0 , delay: 200}}
        out:fly={{ x: -100, y: 0, duration: 200, opacity: 0 }}
      >
        {@render formStep(question)}
      </div>
    {/if}
  {/each}

  {#if formState.error}
    <p class="error">{formState.error}</p>
  {/if}
</main>

{JSON.stringify(formState)}

<style>
  .error {
    color: red;
  }
  div {
    margin-bottom: 10px;
    background: blue;
  }
</style>
