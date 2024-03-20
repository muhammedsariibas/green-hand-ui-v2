<template>
    <v-col style="margin: 0; padding: 0">
        <v-card style="margin: 0; padding: 0; border-radius: 0">
            <v-toolbar style="
            background: linear-gradient(
              60deg,
              rgba(84, 58, 183, 1) 0%,
              rgba(0, 172, 193, 1) 100%
            );
          ">
                <v-toolbar-title style="color: white">

                    <b v-if="regionTitle != null">{{ regionTitle }} - </b>
                    {{ title }}</v-toolbar-title>
                <v-btn class="d-flex" color="white" @click="returnBack">
                    <v-icon>mdi-logout</v-icon>
                    Geri Dön &nbsp;
                </v-btn>
            </v-toolbar>


            <v-card-text>
                <v-tabs v-model="tab" color="white" class="nx" style="height: 60px">
                    <v-col class="d-flex justify-space-between py-0 px-0">
                        <v-tab value="tab-1" v-if="!isApplicationDone">
                            <v-icon >mdi-numeric-1-box</v-icon>
                            Bilgiler
                        </v-tab>
                        <v-tab value="tab-2" v-if="isApplicationDone">
                            <v-icon >mdi-numeric-2-box</v-icon>
                            Onay 
                        </v-tab>
                    </v-col>
                </v-tabs>

                <v-window v-model="tab" class="overflow-y-auto">
                    <v-window-item v-if="!isApplicationDone" value="tab-1">
                        <v-card flat>
                            <v-card-text>
                                <v-row>
                                    <v-col>
                                        <v-text-field :error="errors.name != null" :error-messages="errors.name"
                                            v-model="model.name" label="Adınız" clearable variant="outlined"
                                            bg-color="#F5F5F5" persistent-placeholder
                                            placeholder="Lütfen sadece adınızı giriniz"></v-text-field>
                                    </v-col>
                                    <v-col>
                                        <v-text-field :error="errors.surname != null" :error-messages="errors.surname"
                                            v-model="model.surname" label="Soyadınız" clearable variant="outlined"
                                            bg-color="#F5F5F5" persistent-placeholder
                                            placeholder="Lütfen sadece soyadınızı giriniz"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-text-field :error="errors.phone != null" :error-messages="errors.phone"
                                            v-model="model.phone" label="Telefon Numaranız" clearable variant="outlined"
                                            bg-color="#F5F5F5" persistent-placeholder placeholder="(5xx) xxx xx xx"
                                            v-maska:[phoneMaskOptions]></v-text-field>
                                    </v-col>
                                    <v-col>
                                        <v-text-field :error="errors.socialSecurityNo != null"
                                            :error-messages="errors.socialSecurityNo" v-model="model.socialSecurityNo"
                                            label="TC Kimlik No" clearable variant="outlined" bg-color="#F5F5F5"
                                            persistent-placeholder
                                            placeholder="Lütfen 11 haneli TC Kimlik Numaranızı giriniz"
                                            v-maska:[socialSecurityMaskOptions]></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row v-if="alertMessage != null">
                                    <v-col>
                                        <v-alert type="error">
                                            {{ alertMessage }}
                                        </v-alert>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-btn block color="primary" size="x-large" @click="save">
                                            {{ model.category.name }} BAŞVURUSU YAP
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card-text>

                            <v-overlay v-model="isLoading" persistent absolute
                                class="align-center justify-center flex-column">
                                <div class="d-flex flex-column align-center justify-center">
                                    <v-progress-circular color="white" indeterminate size="85"></v-progress-circular>
                                    <br />
                                    <h1 style="color:white">BAŞVURU TAMAMLANIYOR.</h1>
                                    <br />
                                    <b style="color:white">LÜTFEN BEKLEYİNİZ...</b>
                                </div>
                            </v-overlay>

                        </v-card>
                    </v-window-item>

                    <v-window-item value="tab-2" v-if="isApplicationDone">
                        <v-card flat>
                            <v-card-text>
                                
                                <v-row>
                                    <v-col class="d-flex justify-center py-10" style="  height:100%;
    color:white;">
                                        <v-card elevation="12" height="280px">
                                            <v-col cols="12" sm="12" md="12">
                                                <v-alert type="success">Başvurunuz Tamamlandı</v-alert>
                                                <v-table>

                                                    <tbody>
                                                        <tr>
                                                            <td>Başvuru Tarihi</td>
                                                            <td>{{ newDate() }}</td>
                                                        </tr>

                                                        <tr>
                                                            <td>Açıklama</td>
                                                            <td>Başvurunuz alınmıştır. İlgili birimler sizinle irtibata
                                                                geçecektir.</td>
                                                        </tr>
                                                    </tbody>
                                                </v-table>
                                            </v-col>
                                            <v-card-actions class="d-flex justify-end">
                                                <v-btn
                                                    @click="returnBack"
                                                color="green-darken-2" variant="tonal">
                                                    Ana Sayfaya Dön

                                                    <span class="material-symbols-outlined">
                                                        exit_to_app
                                                    </span>
                                                </v-btn>


                                            </v-card-actions>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-window-item>
                </v-window>
            </v-card-text>

        </v-card>
    </v-col>
</template>
<script lang="ts" setup>
import type { MaskInputOptions } from 'maska'
import { vMaska } from 'maska'
import { ref, onMounted, watchEffect } from 'vue'
import { fetchGet, fetchPost } from "@/Utils/fetchUtils";
import router from '@/router'
import { useRoute } from 'vue-router';
import { useCookies } from '@vueuse/integrations/useCookies'
import { useTokenStore } from '@/stores/tokenStore';

const tokenStore = useTokenStore();
const currentRoute = useRoute();
const categoryId = currentRoute.query.category ?? 0;
const title = ref("BAŞVURU")
const regionTitle = ref<any>(null);

const cookies = useCookies(["device"]);
const isLoading = ref(false);
const isApplicationDone = ref(false);
const alertMessage = ref(null);

const tab = ref("tab-1");
const model = ref<any>({ category: {} });
const device = ref<any>({ name: "" });

function newDate() {
    return new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
}

const errors = ref({
    name: null,
    surname: null,
    phone: null,
    socialSecurityNo: null
})

const socialSecurityMaskOptions: MaskInputOptions = {
    mask: "###########"
}

const phoneMaskOptions: MaskInputOptions = {
    mask: "(5##) ### ## ##"
}

if (cookies.get("device")) {
    device.value = cookies.get("device");
    regionTitle.value = device.value.name;
}else{
    console.log(cookies.get("device"))
    router.push("/?error=deviceNotFound");
}

watchEffect(() => {

    for (var key in model.value) {
        if (model.value[key] && model.value[key] != null && typeof model.value[key] === "string") {
            model.value[key] = model.value[key].toLocaleUpperCase("tr-TR");
        }
    }

})

onMounted(() => {

    refresh();
})


async function refresh() {
    try {
        const response = await fetchGet(`/public/api/v1/aid/one-time-aid/0?categoryId=${categoryId}`);
        model.value = response;
        title.value = response.category.name + " BAŞVURUSU";
    } catch (err) {
        console.error(err);
    }
}

function returnBack() {
    
    if (tokenStore.getTokenExist == false) {
        router.push("/");
    } else {
        router.push("/");
    }
}

function validate() {

    let hasAnyError: boolean = false;

    if (typeof model.value.name === "undefined" || model.value.name == null || model.value.name.length === 0) {
        errors.value.name = "LÜTFEN ADINIZI GİRİNİZ";
        hasAnyError = true;
    } else if (model.value.name.match(/\d/g) != null) {
        errors.value.name = "LÜTFEN ADINIZA RAKAM GİRMEYİNİZ";
        hasAnyError = true;
    }
    else {
        errors.value.name = null;
    }

    if (typeof model.value.surname === "undefined" || model.value.surname == null || model.value.surname.length === 0) {
        errors.value.surname = "LÜTFEN SOYADINIZI GİRİNİZ";
        hasAnyError = true;
    } else if (model.value.surname.match(/\d/g) != null) {
        errors.value.surname = "LÜTFEN SOYADINIZA RAKAM GİRMEYİNİZ";
        hasAnyError = true;
    }
    else {
        errors.value.surname = null;
    }

    var phoneReg = new RegExp(/\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}/)

    if (typeof model.value.phone === "undefined" || model.value.phone == null || model.value.phone.length === 0) {
        errors.value.phone = "LÜTFEN TELEFON NUMARINIZI GİRİNİZ";
        hasAnyError = true;
    } else if (!phoneReg.test(model.value.phone)) {
        errors.value.phone = "LÜTFEN TELEFON NUMARINIZI İSTENİLEN ŞEKİLDE GİRİNİZ";
        hasAnyError = true;
    }
    else {
        errors.value.phone = null;
    }

    var reg = new RegExp(/^\d+$/)
    if (typeof model.value.socialSecurityNo === "undefined" || model.value.socialSecurityNo == null || model.value.socialSecurityNo.length !== 11) {
        errors.value.socialSecurityNo = "LÜTFEN TC KİMLİK NUMARINIZI 11 HANE OLARAK GİRİNİZ";
        hasAnyError = true;
    } else if (!reg.test(model.value.socialSecurityNo)) {
        errors.value.socialSecurityNo = "LÜTFEN TC KİMLİK NUMARINIZI SADECE RAKAM GİRİNİZ";
        hasAnyError = true;
    }
    else {
        errors.value.socialSecurityNo = null;
    }


    return hasAnyError;
}

async function save() {
    if (validate()) return;

    isLoading.value = true;

    try {

        const _model = JSON.parse(JSON.stringify(model.value));
        _model.device = {
            id : device.value.id
        }

        const resp = await fetchPost("/public/api/v1/aid/one-time-aid/0", {
            method: 'POST'
        }, _model);

        if (resp.code == 200) {
           
            isApplicationDone.value = true;
            setTimeout(()=>{
                tab.value = "tab-2";
            },300);
        } else {
            alertMessage.value = "BİR HATA OLUŞTU";
        }
    } catch (err) {
        console.error(err);
        alertMessage.value = "BİR HATA OLUŞTU";
    }

    isLoading.value = false;

}

</script>
  
<style scoped>
.v-window-item {
    height: calc(100vh - 125px);
}
.v-slide-group-item--active {

    background: linear-gradient(60deg,
            rgba(84, 58, 183, 1) 0%,
            rgba(0, 172, 193, 1) 100%);

}
.v-slide-group-item--active {
    color: white;
}
.v-overlay__scrim {
    opacity: 0.7 !important;
}
.v-field--error:not(.v-field--disabled) {
    background-color: rgba(255, 0, 0, .1) !important;
}
</style>