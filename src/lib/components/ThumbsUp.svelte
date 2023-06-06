<script lang="ts">
  import Fa from "svelte-fa";
  import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
  import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";
  import { fade } from "svelte/transition";

  export let playing = false;
  export let won = false;

  $: playing && playAnimation();
  $: setAnimation(won);

  let icon = faThumbsUp;
  let color = "green";

  const setAnimation = (won: boolean) => {
    if (won) {
      icon = faThumbsUp;
      color = "green";
    } else {
      icon = faThumbsDown;
      color = "red";
    }
  };

  const playAnimation = () => {
    setTimeout(async () => {
      playing = true;
      setTimeout(async () => {
        playing = false;
      }, 300);
    }, 300);
  };
</script>

<div transition:fade>
  <Fa style="font-size:10rem; color:{color};" {icon} />
</div>
