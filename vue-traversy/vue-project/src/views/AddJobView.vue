<template>
  <section class="bg-green-50">
    <div class="container max-w-2xl py-24 m-auto">
      <div
        class="px-6 py-8 m-4 mb-4 bg-white border rounded-md shadow-md md:m-0">
        <form @submit.prevent="handleSubmit">
          <h2 class="mb-6 text-3xl font-semibold text-center">Add Job</h2>

          <div class="mb-4">
            <label for="type" class="block mb-2 font-bold text-gray-700"
              >Job Type</label
            >
            <select
              v-model="form.type"
              id="type"
              name="type"
              class="w-full px-3 py-2 border rounded"
              required>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block mb-2 font-bold text-gray-700"
              >Job Listing Name</label
            >
            <input
              v-model="form.title"
              type="text"
              id="name"
              name="name"
              class="w-full px-3 py-2 mb-2 border rounded"
              placeholder="eg. Beautiful Apartment In Miami"
              required />
          </div>
          <div class="mb-4">
            <label for="description" class="block mb-2 font-bold text-gray-700"
              >Description</label
            >
            <textarea
              v-bind="form.description"
              id="description"
              name="description"
              class="w-full px-3 py-2 border rounded"
              rows="4"
              placeholder="Add any job duties, expectations, requirements, etc"></textarea>
          </div>

          <div class="mb-4">
            <label for="type" class="block mb-2 font-bold text-gray-700"
              >Salary</label
            >
            <select
              v-model="form.salary"
              id="salary"
              name="salary"
              class="w-full px-3 py-2 border rounded"
              required>
              <option value="Under $50K">under $50K</option>
              <option value="$50K - $60K">$50 - $60K</option>
              <option value="$60K - $70K">$60 - $70K</option>
              <option value="$70K - $80K">$70 - $80K</option>
              <option value="$80K - $90K">$80 - $90K</option>
              <option value="$90K - $100K">$90 - $100K</option>
              <option value="$100K - $125K">$100 - $125K</option>
              <option value="$125K - $150K">$125 - $150K</option>
              <option value="$150K - $175K">$150 - $175K</option>
              <option value="$175K - $200K">$175 - $200K</option>
              <option value="Over $200K">Over $200K</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block mb-2 font-bold text-gray-700"> Location </label>
            <input
              v-model="form.location"
              type="text"
              id="location"
              name="location"
              class="w-full px-3 py-2 mb-2 border rounded"
              placeholder="Company Location"
              required />
          </div>

          <h3 class="mb-5 text-2xl">Company Info</h3>

          <div class="mb-4">
            <label for="company" class="block mb-2 font-bold text-gray-700"
              >Company Name</label
            >
            <input
              v-model="form.company.name"
              type="text"
              id="company"
              name="company"
              class="w-full px-3 py-2 border rounded"
              placeholder="Company Name" />
          </div>

          <div class="mb-4">
            <label
              for="company_description"
              class="block mb-2 font-bold text-gray-700"
              >Company Description</label
            >
            <textarea
              v-model="form.company.description"
              id="company_description"
              name="company_description"
              class="w-full px-3 py-2 border rounded"
              rows="4"
              placeholder="What does your company do?"></textarea>
          </div>

          <div class="mb-4">
            <label
              for="contact_email"
              class="block mb-2 font-bold text-gray-700"
              >Contact Email</label
            >
            <input
              v-model="form.company.contactEmail"
              type="email"
              id="contact_email"
              name="contact_email"
              class="w-full px-3 py-2 border rounded"
              placeholder="Email address for applicants"
              required />
          </div>
          <div class="mb-4">
            <label
              for="contact_phone"
              class="block mb-2 font-bold text-gray-700"
              >Contact Phone</label
            >
            <input
              v-model="form.company.contactPhone"
              type="tel"
              id="contact_phone"
              name="contact_phone"
              class="w-full px-3 py-2 border rounded"
              placeholder="Optional phone for applicants" />
          </div>

          <div>
            <button
              class="w-full px-4 py-2 font-bold text-white bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:shadow-outline"
              type="submit">
              Add Job
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import axios from 'axios';
import { reactive } from 'vue';

const form = reactive({
  type: 'Full-Time',
  title: '',
  description: '',
  salary: '0',
  location: '',
  company: {
    name: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
  },
});

const handleSubmit = async () => {
  const newJob = {
    title: form.title,
    type: form.type,
    description: form.description,
    salary: form.salary,
    location: form.location,
    company: {
      name: form.company.name,
      description: form.company.description,
      contactEmail: form.company.contactEmail,
      contactPhone: form.company.contactPhone,
    },
  };
  try {
    const response = await axios.post('/api/jobs', newJob);
    toast.success('Job Added Successfully');
    router.push(`/jobs/${response.data.id}`);
  } catch (error) {
    console.error('Error fetching job', error);
    toast.error('Job Was Not Added');
  }
};
</script>
