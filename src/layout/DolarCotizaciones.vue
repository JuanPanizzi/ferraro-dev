<script setup>
import { DolarService } from '@/service/DolarService';
import { computed, onMounted, ref } from 'vue';

const cotizaciones = ref({
  billete: '',
  divisa: ''
});

const formatNumber = (value) => {
  const number = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
  return isNaN(number) ? '0.00' : number.toFixed(2);
};

const billeteFormatted = computed(() => formatNumber(cotizaciones.value.billete));
const divisaFormatted = computed(() => formatNumber(cotizaciones.value.divisa));

const fetchCotizaciones = async () => {
  try {
    const response = await DolarService.getCotizaciones();
    const data = response;
    cotizaciones.value = {
      billete: data.billetes.cotizaciones.find(c => c[0] === 'Dolar U.S.A')[2],
      divisa: data.divisas.cotizaciones.find(c => c[0] === 'Dolar U.S.A')[2]
    };
  } catch (error) {
    console.error('Error al obtener cotizaciones:', error);
  }
};

onMounted(fetchCotizaciones);
</script>

<template>
  <div class="dolar-cotizaciones">
    <span class="cotizacion">
      <strong>Dólar Billete:</strong> $ {{ billeteFormatted }}
    </span>
    <span class="cotizacion">
      <strong>Dólar Divisa:</strong> $ {{ divisaFormatted }}
    </span>
  </div>
</template>

<style scoped>
.dolar-cotizaciones {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: var(--surface-card);
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
}
.cotizacion {
  margin-bottom: 0.25rem;
}
</style>