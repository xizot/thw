#!/usr/bin/env zx

const helmCharts = ["shop-db"];

async function devUpdate() {
  for (const chart of helmCharts) {
    await $`helm dependency  update ./helm/${chart}`;
  }
}

async function dockerBuildApi() {
  await $`sudo docker build -t toihocweb/api-rest api/rest`;
  await $`sudo docker push toihocweb/api-rest`;
}

async function dockerBuildShop() {
  await $`sudo docker build -t toihocweb/shop shop`;
  await $`sudo docker push toihocweb/shop`;
}

async function dockerBuildAdmin() {
  await $`sudo docker build -t toihocweb/admin admin/rest`;
  await $`sudo docker push toihocweb/admin`;
}

async function deploy() {
  await devUpdate();
  // await dockerBuildApi();
  // await dockerBuildShop();
  // await dockerBuildAdmin();

  for (const chart of helmCharts) {
    await $`helm upgrade --install ${chart} ./helm/${chart}`;
  }
}

deploy().catch(console.error);
