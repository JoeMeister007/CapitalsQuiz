<script>
	import favicon from '$lib/assets/favicon.svg';

	import 'bootstrap/dist/css/bootstrap.min.css';
    import { onMount } from 'svelte';
	// Import Bootstrap JS
	// We do this in onMount so it's only loaded in the browser
	// prevents SSR errors
    onMount(async () => {
        await import('bootstrap/dist/js/bootstrap.bundle.min.js');
    });
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
