import {
  NCard,
  NGradientText,
  NSpace,
  NTimeline,
  NTimelineItem,
} from "naive-ui";

export default defineNuxtComponent({
  async setup() {
    useHead({
      title: "Inicontent | Homepage",
      script: [
        {
          src: "https://www.paypal.com/sdk/js?client-id=AReVheO6-Eb0Zr34SOutS3lZtcBNXUjuqcdKYHZdpzUYqUE4N1KzSuizSJH2ZN7oLl9wZul1wu6hbZqY&vault=true&intent=subscription",
          body: false,
        },
      ],
    });

    useLanguage({
      ar: {
        pick_a_plan: "إختر خطة",
        monthly_plan: "الخطة الشهرية",
        subscription_success: "تم الإشتراك بنجاح",
      },
      en: {
        pick_a_plan: "Pick a plan",
        monthly_plan: "Monthly Plan",
        subscription_success: "Subscribed Successfully",
      },
    });

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
              message.success(t("subscription_success"));
              // UserCookie.value.subscriptionID = data.subscriptionID;
              navigateTo("/auth?tab=signup");
            },
          })
          .render("#paypal-button-container-P-940647543A404405XMMTAXAI");
      else setTimeout(PaypalButton, 250);
    }
    onMounted(() => PaypalButton());
    return () =>
      h(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          },
        },
        h(
          NCard,
          {
            title: t("pick_a_plan"),
            hoverable: true,
            style: { maxWidth: "300px" },
          },
          () => [
            h(
              NCard,
              {
                title: t("monthly_plan"),
                hoverable: true,
              },
              () =>
                h(
                  NSpace,
                  {
                    justify: "center",
                  },
                  () => [
                    h(NTimeline, () => [
                      h(NTimelineItem, { title: "Unlimited Databases" }),
                      h(NTimelineItem, { title: "Unlimited Tables" }),
                      h(NTimelineItem, { title: "Unlimited Users & Roles" }),
                      h(NTimelineItem, { title: "Unlimited Uploads" }),
                      h(NTimelineItem, { title: "Fast CDN" }),
                    ]),
                    h(
                      NGradientText,
                      {
                        type: "error",
                        size: "x-large",
                      },
                      () => "4.99$"
                    ),
                    h("div", {
                      id: "paypal-button-container-P-940647543A404405XMMTAXAI",
                    }),
                  ]
                )
            ),
          ]
        )
      );
  },
});
