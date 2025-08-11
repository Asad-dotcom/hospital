<template>
  <div class="container py-4">
    <h3>Billing History</h3>

    <div v-if="bills.length === 0" class="alert alert-warning">
      No bills generated yet.
    </div>

    <table v-else class="table table-striped table-bordered mt-3">
      <thead class="thead-light">
        <tr>
          <th>Date</th>
          <th>Patient</th>
          <th>Appointment ID</th>
          <th>Services</th>
          <th>Total (Rs)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(bill, i) in bills" :key="i">
          <td>{{ bill.date }}</td>
          <td>{{ bill.patient }}</td>
          <td>{{ bill.appointmentId }}</td>
          <td>
            <ul class="list-unstyled mb-0">
              <li v-for="(svc, idx) in bill.services" :key="idx">
                {{ svc.name }} (Rs {{ svc.cost }})
              </li>
            </ul>
          </td>
          <td><strong>{{ bill.total }}</strong></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import BillingService from '@/api/services/billingService';

export default {
  data() {
    return {
      billingHistory: []
    }
  },
  async created() {
    this.billingHistory = await BillingService.getBillingHistory();
  }
}
</script>