<script lang="ts">
  import { createState, AlexState } from "./state.svelte";
  let {
    name,
  }: {
    name: string;
  } = $props();

  const myState = createState();
  const myState2 = new AlexState();
</script>

<div>
  <h1>{name ? name : "User"}'s Profile</h1>
  <button onclick={myState.up}>{myState.value} </button>
  <button onclick={() => myState2.up()}>{myState2.value} </button>
</div>

<style>
  div {
    margin: 0 auto;
    width: 50%;
    text-align: center;
  }
</style>
