<script lang="ts">
	import { version } from "$app/environment";
  import { Dropzone, Heading, P, Footer, FooterCopyright } from 'flowbite-svelte'
  import XmlViewer from "../components/xmlViewer.svelte";

  let dropzoneValue: File | null;
  let currentDate = (new Date()).getFullYear();

  let onChangeDropzone = (e: Event) => {
    if (null == e.target) return;

    let input = <HTMLInputElement> e.target;

    if (null == input.files) return;

    dropzoneValue = input.files[0]
  }

  let clearFile = () => dropzoneValue = null;
</script>

<div class="container mx-auto">
  <div class="text-center py-10 px-10">
    <Heading tag="h1" class="mb-4" customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl">Welcome to Nominator v{version}</Heading>
    <P class="mb-4 text-lg lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400 text-center">A secure payroll viewer</P>
  </div>

  {#if dropzoneValue}
    <XmlViewer file={dropzoneValue} />

    <div class="text-center p-4">
      <a class="underline text-blue-600" href="/" on:click={clearFile}>Upload another file</a>
    </div>
  {:else}
    <Dropzone id='dropzone' on:change={onChangeDropzone}>
      <svg aria-hidden="true" class="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
      <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
      <p class="text-xs text-gray-500 dark:text-gray-400">XML (MAX. 1MB)</p>
    </Dropzone>
  {/if}
</div>

<Footer>
  <FooterCopyright href="/" by="Jesús Magallón" year={currentDate} />
</Footer>
