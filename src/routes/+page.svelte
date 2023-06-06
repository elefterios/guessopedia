<script lang="ts">
  import ThumbsUp from "$lib/components/ThumbsUp.svelte";
  import { onMount } from "svelte";
  import { getRandomArticle } from "../lib/service/wikipedia-api";

  let img: any = null;
  let choices: string[] = [];
  let correctChoiceIdx = -1;
  let score = 0;
  let max_choices = 10;
  let loading = true;

  let animationPlaying = false;
  let roundWon = false;

  $: !animationPlaying && loadNewQuestion();

  const loadNewQuestion = () => {
    loading = true;
    getRandomArticle(max_choices).then((d) => {
      loading = false;

      if (!d) return;
      img = d.img;
      choices = d.choices;
      correctChoiceIdx = d.correctChoiceIdx;
      loading = false;
      console.log(
        choices.map((c, i) => i + 1 + ". " + c).join("\n") +
          "\ncorrectChoice: " +
          (correctChoiceIdx + 1)
      );
    });
  };

  const checkAnswer = (btnIdx: number) => {
    roundWon = btnIdx === correctChoiceIdx;
    if (roundWon) {
      score++;
      console.log("yeiii");
    }
    animationPlaying = true;
  };

  onMount(loadNewQuestion);
</script>

<div id="main-content">
  <h1>Which article does this image belong to?</h1>
  <p>Score: {score}</p>

  {#if animationPlaying}
    <div id="thumbs">
      <ThumbsUp bind:playing={animationPlaying} bind:won={roundWon} />
    </div>
  {:else if !loading}
    <div id="quizImageContainer">
      <img id="quizImage" bind:this={img} src={img.src} alt="" />
    </div>
    <div id="choices">
      {#each choices as choice, idx}
        <button
          on:click={() => {
            checkAnswer(idx);
          }}>{idx + 1}. {choice}</button
        >
      {/each}
    </div>
  {:else}
    <div>loading</div>
  {/if}

  <h3>Maximum number of choices</h3>
  <form>
    <select bind:value={max_choices} on:change={loadNewQuestion}>
      {#each [5, 10, 20, 50, 100] as num}
        <option value={num}>
          {num}
        </option>
      {/each}
    </select>
  </form>
</div>

<style>
  #main-content {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 0;
    bottom: 0;
  }
  #choices {
    display: flex;
    flex-direction: column;
    height: fit-content;
  }
  #quizImageContainer {
    height: 50%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #quizImageContainer img {
    display: block;
    width: auto;
    height: 100%;
    max-height: 100%;
    max-width: 100%;
  }
  #thumbs {
    position: absolute;
    top: 25%;
    left: 50%;
  }
</style>
