<template>
  <div
    :style="{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    }"
  >
    <n-card title="Pick a Plan" hoverable style="max-width: 300px">
      <n-card title="Monthly Plan" hoverable>
        <n-space justify="center">
          <n-timeline>
            <n-timeline-item title="Unlimited Databases" />
            <n-timeline-item title="Unlimited Tables" />
            <n-timeline-item title="Unlimited Users & Roles" />
            <n-timeline-item title="Unlimited Uploads" />
            <n-timeline-item title="Fast CDN" />
          </n-timeline>
          <n-gradient-text type="error" size="x-large"> 4.99$ </n-gradient-text>
          <div id="paypal-button-container-P-940647543A404405XMMTAXAI"></div>
        </n-space>
      </n-card>
    </n-card>
  </div>
</template>

<script setup>
import {
  NCard,
  useMessage,
  NSpace,
  NTimeline,
  NTimelineItem,
  NGradientText,
} from "naive-ui";

useHead({
  title: "Inicontent | Homepage",
  script: [
    {
      src: "https://www.paypal.com/sdk/js?client-id=AReVheO6-Eb0Zr34SOutS3lZtcBNXUjuqcdKYHZdpzUYqUE4N1KzSuizSJH2ZN7oLl9wZul1wu6hbZqY&vault=true&intent=subscription",
      body: false,
    },
  ],
});

const message = useMessage(),
  UserCookie = useCookie("User");

function PaypalButton() {
  if (typeof window.paypal !== "undefined")
    window.paypal
      .Buttons({
        style: {
          shape: "pill",
          color: "white",
          layout: "vertical",
          label: "subscribe",
        },
        createSubscription: function (data, actions) {
          return actions.subscription.create({
            plan_id: "P-940647543A404405XMMTAXAI",
          });
        },
        onApprove: function (data, actions) {
          message.success("Subscribed Successfully");
          UserCookie.value.subscriptionID = data.subscriptionID;
          navigateTo("/auth?tab=signup");
        },
      })
      .render("#paypal-button-container-P-940647543A404405XMMTAXAI");
  else setTimeout(PaypalButton, 250);
}
onMounted(() => PaypalButton());
</script>
