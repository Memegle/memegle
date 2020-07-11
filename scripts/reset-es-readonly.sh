#!/bin/bash

# reset the read only property of memegle.pictures index of es
# https://www.elastic.co/guide/en/elasticsearch/reference/6.2/disk-allocator.html
curl -X PUT "localhost:9200/memegle.pictures/_settings?pretty" -H 'Content-Type: application/json' -d'
{
  "index.blocks.read_only_allow_delete": null
}
'
