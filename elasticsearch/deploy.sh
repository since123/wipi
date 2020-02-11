docker network create wipi

docker run -d --restart=always --name wipi-elasticsearch --net wipi -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" --memory="1g" elasticsearch:7.1.1
docker run -it -d --restart=always --name wipi-logstash --net wipi -p 5044:5044 -v $(pwd)/logstash/logstash.yml:/usr/share/logstash/config/logstash.yml -v $(pwd)/logstash/:/usr/share/logstash/conf.d/ logstash:7.1.1

docker cp $(pwd)/elasticsearch.yml wipi-elasticsearch:/usr/share/elasticsearch/config/elasticsearch.yml
docker cp $(pwd)/jdbc/mysql-connector-java-5.1.38.jar wipi-logstash:/usr/share/logstash/plugins/

