<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  let { carts } = data || [];
</script>

<svelte:head>
  <title>Get Carts Page</title>
</svelte:head>

<h1 class="text-xl mb-4">Get Carts Page</h1>

<table class="w-full border">
  <thead>
    <tr class="border">
      <th class="border p-4">id</th>
      <th class="border p-4">userUuid</th>
      <th class="border p-4">cartCode</th>
      <th class="border p-4">cartItems</th>
    </tr>
  </thead>
  <tbody>
    {#each carts as cart}
      <tr class="border">
        <td class="border p-4">{cart.id}</td>
        <td class="border p-4">{cart.userUuid}</td>
        <td class="border p-4">{cart.cartCode}</td>
        <td class="border p-4">
          <div class="flex flex-col gap-4">
            {#each cart.cartItems as cartItem}
              <ul class="bg-blue-100 p-4">
                <li>id: {cartItem.id}</li>
                <li>skuCode: {cartItem.skuCode}</li>
                <li>price: {cartItem.price}</li>
                <li>quantity: {cartItem.quantity}</li>
                <li>cartId: {cartItem.cartId}</li>
              </ul>
            {/each}
          </div>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
