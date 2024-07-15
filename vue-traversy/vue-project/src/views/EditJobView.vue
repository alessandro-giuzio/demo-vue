<script setup>
import router from '@/router';
import { reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from 'axios';

const route = useRoute();

const jobId = route.params.id;

const form = reactive({
  type: 'Full-Time',
  title: '',
  description: '',
  salary: '',
  location: '',
  company: {
    name: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
  },
});

const state = reactive({
  job: {},
  isLoading: true,
});

const toast = useToast();

const handleSubmit = async () => {
  const updatedJob = {
    title: form.title,
    type: form.type,
    location: form.location,
    description: form.description,
    salary: form.salary,
    company: {
      name: form.company.name,
      description: form.company.description,
      contactEmail: form.company.contactEmail,
      contactPhone: form.company.contactPhone,
    },
  };

  try {
    const response = await axios.put(`/api/jobs/${jobId}`, updatedJob);
    toast.success('Job Updated Successfully');
    router.push(`/jobs/${response.data.id}`);
  } catch (error) {
    console.error('Error fetching job', error);
    toast.error('Job Was Not Added');
  }
};

onMounted(async () => {
  try {
    const response = await axios.get(`/api/jobs/${jobId}`);
    state.job = response.data;
    // Populate inputs
    form.type = state.job.type;
    form.title = state.job.title;
    form.description = state.job.description;
    form.salary = state.job.salary;
    form.location = state.job.location;
    form.company.name = state.job.company.name;
    form.company.description = state.job.company.description;
    form.company.contactEmail = state.job.company.contactEmail;
    form.company.contactPhone = state.job.company.contactPhone;
  } catch (error) {
    console.error('Error fetching job', error);
  } finally {
    state.isLoading = false;
  }
});
</script>

<template>
  <section class="bg-green-50">
    <div class="container max-w-2xl py-24 m-auto">
      <div
        class="px-6 py-8 m-4 mb-4 bg-white border rounded-md shadow-md md:m-0">
        <form @submit.prevent="handleSubmit">
          <h2 class="mb-6 text-3xl font-semibold text-center">Edit Job</h2>

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
              type="text"
              v-model="form.title"
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
              id="description"
              v-model="form.description"
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
              id="salary"
              v-model="form.salary"
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
              type="text"
              v-model="form.location"
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
              type="text"
              v-model="form.company.name"
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
              id="company_description"
              v-model="form.company.description"
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
              type="email"
              v-model="form.company.contactEmail"
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
              type="tel"
              v-model="form.company.contactPhone"
              id="contact_phone"
              name="contact_phone"
              class="w-full px-3 py-2 border rounded"
              placeholder="Optional phone for applicants" />
          </div>

          <div>
            <button
              class="w-full px-4 py-2 font-bold text-white bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:shadow-outline"
              type="submit">
              Update Job
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
