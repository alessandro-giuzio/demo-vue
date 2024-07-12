<template>
  <section class="bg-green-50">
    <div class="container px-6 py-10 m-auto">
      <div class="grid w-full grid-cols-1 gap-6 md:grid-cols-70/30">
        <main>
          <div
            class="p-6 text-center bg-white rounded-lg shadow-md md:text-left">
            <div class="mb-4 text-gray-500">Full-Time</div>
            <h1 class="mb-4 text-3xl font-bold">Senior Vue Developer</h1>
            <div
              class="flex justify-center mb-4 text-gray-500 align-middle md:justify-start">
              <i
                class="mr-2 text-lg text-orange-700 fa-solid fa-location-dot"></i>
              <p class="text-orange-700">Boston, MA</p>
            </div>
          </div>

          <div class="p-6 mt-6 bg-white rounded-lg shadow-md">
            <h3 class="mb-6 text-lg font-bold text-green-800">
              Job Description
            </h3>

            <p class="mb-4">
              We are seeking a talented Front-End Developer to join our team in
              Boston, MA. The ideal candidate will have strong skills in HTML,
              CSS, and JavaScript, with experience working with modern
              JavaScript frameworks such as Vue or Angular.
            </p>

            <h3 class="mb-2 text-lg font-bold text-green-800">Salary</h3>

            <p class="mb-4">$70k - $80K / Year</p>
          </div>
        </main>

        <!-- Sidebar -->
        <aside>
          <!-- Company Info -->
          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="mb-6 text-xl font-bold">Company Info</h3>

            <h2 class="text-2xl">NewTek Solutions</h2>

            <p class="my-2">
              NewTek Solutions is a leading technology company specializing in
              web development and digital solutions. We pride ourselves on
              delivering high-quality products and services to our clients while
              fostering a collaborative and innovative work environment.
            </p>

            <hr class="my-4" />

            <h3 class="text-xl">Contact Email:</h3>

            <p class="p-2 my-2 font-bold bg-green-100">
              contact@newteksolutions.com
            </p>

            <h3 class="text-xl">Contact Phone:</h3>

            <p class="p-2 my-2 font-bold bg-green-100">555-555-5555</p>
          </div>

          <!-- Manage -->
          <div class="p-6 mt-6 bg-white rounded-lg shadow-md">
            <h3 class="mb-6 text-xl font-bold">Manage Job</h3>
            <a
              href="add-job.html"
              class="block w-full px-4 py-2 mt-4 font-bold text-center text-white bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:shadow-outline"
              >Edit Job</a
            >
            <button
              class="block w-full px-4 py-2 mt-4 font-bold text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:shadow-outline">
              Delete Job
            </button>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup></script>
