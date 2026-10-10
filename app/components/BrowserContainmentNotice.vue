<template>
 <div v-if="quarantined" role="alert" class="containment-notice">{{ t("offlineQuarantineNotice") }}</div>
</template>
<script setup lang="ts">
const quarantined = useState<boolean>("containment_quarantined", () => false);
</script>
<style scoped>
.containment-notice { padding: 12px 20px; background: #fff3cd; color: #493900; font-size: 14px; line-height: 1.5; }
</style>
