<script lang="ts">
  import type { PageProps } from './$types';

  let { form }: PageProps = $props();
</script>

<svelte:head>
  <title>Add Cart Page</title>
</svelte:head>

<h1 class="text-xl mb-4">Add Cart Page</h1>

<form class="flex flex-col gap-4 pr-8" method="POST" novalidate>
  {#if form?.success}
    <p class="text-red-950 font-bold mb-4">Cart has been added!</p>
  {/if}

  <label class="flex items-center gap-2">
    <span class="w-[120px]">userUuid</span>
    <input class="flex-1" type="text" name="userUuid" value="sample-user">
  </label>
  <label class="flex items-center gap-2">
    <span class="w-[120px]">cartCode</span>
    <input class="flex-1" type="text" name="cartCode" value="b85c9d3c24a39f22cd9e2924a079d5cd0ce569c3e29c3c24597f4ea3ec654bc3">
  </label>
  <label class="flex items-center gap-2">
    <span class="w-[120px]">quantity</span>
    <input class="flex-1" type="number" name="quantity" value="1">
  </label>
  <label class="flex items-center gap-2">
    <span class="w-[120px]">sku.skuCode</span>
    <input class="flex-1" type="text" name="skuCode" value="9">
  </label>
  <label class="flex items-center gap-2">
    <span class="w-[120px]">sku.price</span>
    <input class="flex-1" type="number" name="price" value="60000">
  </label>
  <button class="w-[200px] bg-blue-500 text-white transition-all cursor-pointer p-2 m-auto hover:bg-blue-700" type="submit">SEND</button>
</form>
