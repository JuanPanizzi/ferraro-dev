<template>
    <Dialog v-model:visible="visible" :style="{ width: '650px' }" header="Detalles del ARTICULO" :modal="true">
        <div class="flex flex-col gap-4">
            <div class="flex justify-start gap-4">
                <label for="codigo" class="block font-bold mb-2">Código</label>
                <InputText id="codigo" v-model="articulo.COD_ART" readonly />

                <label for="material" class="block font-bold mb-2">Material</label>
                <InputText id="material" v-model="articulo.MAT_ART" />
            </div>

            <div class="flex gap-4">
                <label for="descripcion" class="block font-bold mb-2">Descripción</label>
                <InputText id="descripcion" v-model="articulo.NOM_ART" class="w-full" />
            </div>

            <div class="flex gap-4">
                <label for="nroplano" class="block font-bold mb-2">Nº de Plano</label>
                <InputText id="nroplano" v-model="articulo.NROPLANO_ART" />
                <label for="revision" class="block font-bold mb-2">Rev</label>
                <InputText id="revision" v-model="articulo.REV_PLANO" />
            </div>

            <div class="flex gap-4">
                <label for="cliente" class="block font-bold mb-2">Cliente</label>
                <Select :options="clients" filter optionLabel="LABEL_CLI"
                    placeholder="Seleccione un cliente" class="w-full md:w-full"
                    emptyFilterMessage="No se encontraron clientes" emptyMessage="No hay clientes"
                    @change="changeCliente" emptySelectionMessage="Seleccione un cliente">
                </Select>
            </div>

            <hr />

            <div class="flex justify-between gap-4">
                <div>
                    <label for="costo_mp" class="block font-bold mb-2">Costo MP</label>
                    <InputNumber id="costo_mp" v-model="articulo.COSMP_ART" mode="currency" currency="USD" locale="en-US" />
                </div>
                <div>
                    <label for="costo_mo" class="block font-bold mb-2">Costo MO</label>
                    <InputNumber id="costo_mo" v-model="articulo.COSMO_ART" mode="currency" currency="USD" locale="en-US" />
                </div>
                <div>
                    <label for="costo_total" class="block font-bold mb-2">Costo Total</label>
                </div>
            </div>

            <div class="flex justify-between gap-4">
                <div>
                    <label for="utilidad" class="block font-bold mb-2">Utilidad</label>
                    <InputNumber id="utilidad" v-model="articulo.UTI_ART" suffix="%" />
                </div>

                <div>
                    <label for="precio_venta" class="block font-bold mb-2">Precio de Venta</label>
                    <InputNumber id="precio_venta" v-model="articulo.PV_ART" mode="currency" currency="USD" locale="en-US" />
                </div>
            </div>
        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="cancel" />
            <Button label="Guardar" icon="pi pi-check" @click="save" />
        </template>
    </Dialog>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        articulo: {
            type: Object,
            required: true,
        },
        clients: {
            type: Array,
            required: true,
        },
    },
    methods: {
        cancel() {
            this.$emit('update:visible', false);
        },
        save() {
            this.$emit('save', this.articulo);
        },
        changeCliente(selectedClient) {
            // Handle client change logic here if necessary
        },
    },
};
</script>

<style scoped>
/* Puedes agregar estilos específicos para el componente aquí */
</style>
