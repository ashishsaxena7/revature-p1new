#!/bin/bash

app=$1
serviceplan=$2
group=$3
location=$4
cosmosAccount=$5
primaryKey=$6
storageAccountName=$7
blobStorageAccountKey=$8
gitrepo=https://github.com/ashishsaxena7/projecttesting
token=a5d97e8da6db7d204b4cb0e4d6ffaa3684764b63

az appservice plan create --name $serviceplan -g $group --sku B1 --location $location --is-linux
az webapp create -g $group --plan $serviceplan --name $app -r "node|10.14"
az storage account create --name pleasetest -g $group --kind BlobStorage --location southcentralus --access-tier Hot
az storage container create --name testplease --public-access blob --account-name pleasetest --account-key IxfAmoww8nPiDfaSN512+2X+aHTJKoGqGFxaER91Ucz2VXvHUBCZ/zSdmlxaPavr3Gl2PF5o/EzDNBldkQ0PnA==
az storage account keys list --account-name pleasetest -g $group --query [0].value --output tsv
az cosmosdb create --name pleasetest2 -g $group
az cosmosdb database create --db-name testing123 --name pleasetest2 -g testcase
az cosmosdb collection create --collection-name testplease2 -g testcase --db-name testing123 --name pleasetest2


az webapp deployment source config --name $app -g $group --repository-type github --repo-url $gitrepo --branch master --git-token $token
az webapp config appsettings set -g $group -n $app --settings AZURE_COSMOS_URI=$cosmosAccount
az webapp config appsettings set -g $group -n $app --settings AZURE_COSMOS_PRIMARY_KEY=$primaryKey
az webapp config appsettings set -g $group -n $app --settings AZURE_STORAGE_ACCOUNT_NAME=$storageAccountName
az webapp config appsettings set -g $group -n $app --settings AZURE_STORAGE_ACCOUNT_ACCESS_KEY=$blobStorageAccountKey


az appservice plan update -g $group --name $serviceplan --number-of-workers 3

