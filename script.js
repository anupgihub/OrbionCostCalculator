<script>
document.addEventListener("DOMContentLoaded", function () {
  const $ = (id) => document.getElementById(id);

  const PRICING_GRID = {
    accessGov: [
      { max: 100, price: 25.263 },
      { max: 500, price: 21.660 },
      { max: 1000, price: 13.900 },
      { max: 2000, price: 9.750 },
      { max: 3000, price: 7.380 },
      { max: 5000, price: 5.530 },
      { max: 7500, price: 4.900 },
      { max: 10000, price: 4.200 },
      { max: 15000, price: 3.370 },
      { max: 20000, price: 2.730 },
      { max: 25000, price: 2.420 },
      { max: 50000, price: 1.610 }
    ],
    analytics: [
      { max: 100, price: 1.775 },
      { max: 500, price: 1.570 },
      { max: 1000, price: 0.990 },
      { max: 2000, price: 0.740 },
      { max: 3000, price: 0.560 },
      { max: 5000, price: 0.430 },
      { max: 7500, price: 0.410 },
      { max: 10000, price: 0.360 },
      { max: 15000, price: 0.290 },
      { max: 20000, price: 0.230 },
      { max: 25000, price: 0.200 },
      { max: 50000, price: 0.130 }
    ],
    recert: [
      { max: 100, price: 3.550 },
      { max: 500, price: 3.130 },
      { max: 1000, price: 1.980 },
      { max: 2000, price: 1.470 },
      { max: 3000, price: 1.120 },
      { max: 5000, price: 0.870 },
      { max: 7500, price: 0.820 },
      { max: 10000, price: 0.710 },
      { max: 15000, price: 0.570 },
      { max: 20000, price: 0.460 },
      { max: 25000, price: 0.400 },
      { max: 50000, price: 0.270 }
    ]
  };

  function getTieredPrice(table, users) {
    for (let i = 0; i < table.length; i++) {
      if (users <= table[i].max) return table[i].price ?? 0;
    }
    return table[table.length - 1].price;
  }

  const fmt = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2
  }).format;

  const FEATURES = {
    access: ["Single Sign‑On (SSO)", "Multi‑Factor Authentication (MFA)"],
    accessGov: [
      "Single Sign‑On (SSO)",
      "Multi‑Factor Authentication (MFA)",
      "Identity Governance & Administration (IGA)"
    ],
    analytics: ["Analytics Editor option"],
    srPack: [
      "Service Integration Starter Pack (35 WU)",
      "Integration kick-off workshop",
      "SSO template configuration",
      "Role modeling baseline",
      "Support for up to 5 applications onboarding"
    ],
    recert: ["Periodic Access Recertification Campaign"]
  };

  function calculate(users, pkg, upgrade, years, isRecert) {
    const unitBase = getTieredPrice(PRICING_GRID.accessGov, users);
    const unitUpg = getTieredPrice(PRICING_GRID.analytics, users);
    const unitRecert = getTieredPrice(PRICING_GRID.recert, users);

    const basePrice = users * unitBase;
    const upgradePrice = upgrade ? users * unitUpg : 0;
    const recertPrice = isRecert ? users * unitRecert : 0;
    const wuCount = pkg === "accessGov" ? 35 : 0;
    const srPrice = wuCount * 1350;

    const discount = years === 2 ? 0.05 : years === 3 ? 0.08 : years === 5 ? 0.12 : 0;
    const discountedMonthly = (basePrice + upgradePrice + recertPrice) * (1 - discount);
    const yearlyPrice = discountedMonthly * 12;
    const totalSubscriptionPrice = yearlyPrice * years;
    const totalPrice = totalSubscriptionPrice + srPrice;

    return {
      basePrice,
      upgradePrice,
      recertPrice,
      srPrice,
      yearlyPrice,
      totalSubscriptionPrice,
      totalPrice,
      wuCount,
      unitBase,
      unitUpg,
      unitRecert,
      years
    };
  }

  function render(users, pkg, upgrade, isRecert, c) {
    $("packageText").textContent = `Selected Package: ${pkg === "access" ? "Orbion Access" : "Orbion Access & Governance"}${upgrade ? " + Analytics Editor Option" : ""}${isRecert ? " + Recertification Campaign" : ""}`;
    $("usersText").textContent = `Number of Users: ${users}`;
    $("durationText").textContent = `Contract Duration: ${c.years} year${c.years > 1 ? "s" : ""}`;

    const list = [];
    list.push(`Base Subscription: ${fmt(c.unitBase)}/user/mo &times; ${users} users = ${fmt(c.basePrice)}`);
    if (upgrade) list.push(`Analytics Editor Option: ${fmt(c.unitUpg)}/user/mo &times; ${users} users = ${fmt(c.upgradePrice)}`);
    if (isRecert) list.push(`Recertification Campaign: ${fmt(c.unitRecert)}/user/mo &times; ${users} users = ${fmt(c.recertPrice)}`);
    if (c.wuCount > 0) list.push(`Service Integration Starter Pack: 35 WU &times; &euro;1350 = ${fmt(c.srPrice)}`);

    $("breakdownText").innerHTML = list.map((x) => `<li>${x}</li>`).join("");

    $("subYearly").textContent = `Subscription price (${c.years} year${c.years > 1 ? "s" : ""}): ${fmt(c.totalSubscriptionPrice)}`;
    $("srOneOff").textContent = `Complementary service price (WU): ${fmt(c.srPrice)}`;
    $("totalYearly").textContent = `TOTAL price over ${c.years} year${c.years > 1 ? "s" : ""}: ${fmt(c.totalPrice)}`;

    const feats = [
      ...FEATURES[pkg],
      ...(upgrade ? FEATURES.analytics : []),
      ...(c.wuCount > 0 ? FEATURES.srPack : []),
      ...(isRecert ? FEATURES.recert : [])
    ];
    $("featuresText").innerHTML = feats.map((f) => `<li>${f}</li>`).join("");

    const notes = [
      "All prices shown are in EUR, excluding taxes.",
      "Subscription billed annually in advance.",
      "Complementary service‑request packs invoiced upon delivery.",
      "Standard business‑hours support included.",
      `<a href="https://customercare.evidian.com/space/ITS/384991233/IDaaS%2FOrbion+Terms+of+Services+-+Evidian" target="_blank" class="text-blue-700 underline">View Orbion Terms of Services</a>`
    ];
    $("notesText").innerHTML = notes.map((n) => `<li>${n}</li>`).join("");

    $("result").classList.remove("hidden");
  }

  $("costForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const users = parseInt($("numUsers").value, 10) || 0;
    if (users < 1) return alert("Number of users must be at least 1");
    const pkg = $("packageType").value;
    const upgrade = $("upgrade").checked;
    const isRecert = $("recert").checked;
    const years = parseInt($("contractYears").value, 10) || 1;
    const costs = calculate(users, pkg, upgrade, years, isRecert);
    render(users, pkg, upgrade, isRecert, costs);
  });
});
</script>
