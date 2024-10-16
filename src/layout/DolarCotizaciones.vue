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
  <div class="dolar-cotizaciones max-[388px]:text-center max-[388px]:py-2 max-[388px]:min-w-[67px] max-[388px]:pl-1">
    <span class="cotizacion max-[388px]:text-[0.5rem]  text-xs sm:text-sm md:text-md ">
      <strong>U$D Bill. </strong> $ {{ billeteFormatted }} <br />
      <strong>U$D Div. </strong> $ {{ divisaFormatted }}
    </span>
  </div>
</template>

<style scoped>
.dolar-cotizaciones {

  align-items: center;
  font-size: 0.85rem;
  border-radius: var(--content-border-radius);
  color: var(--text-color);
  font-weight: 500;
  gap: 0.5rem;
}

.cotizacion {}
</style>