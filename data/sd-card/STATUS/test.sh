header="Date,Time,Temp_PT100_1,Temp_PT100_2,pH_Value,Bag_Height"

# for i in {1..30}
# do
#     fileName=$(printf "1703%02d.csv\n" $i)
#     touch $fileName
    # echo $header > $fileName
#     for dataPoint in {0..59}
    # do
    #     printf "%02d-03-2017,15:%02d:40,0,0,0,318.049\n" "$i" "$dataPoint" >> $fileName
    # done
# done

# for date in 2016-02-{01..28} 2016-{04,06,09,11}-{01..30} 2016-{01,03,05,07,08,10,12}-{01..31}
for date in 2017-02-{01..28} 2016-04-{01..30} 2016-{01,03,05}-{01..31}
do
    year=$(printf "%02s" ${date:2:2})
    month=$(printf "%02s" ${date:5:2})
    day=$(printf "%02s" ${date:8:2})
    fileName=$(printf "%02s%02s%02s.csv\n" $year $month $day )
    cat ./170607.CSV | awk -v year=$year -v month=$month -v day=$day -F ',' 'BEGIN{
        OFS = ","
        } {
            if (substr($1,1,1) == "D") {print $0}
            else {print day"-"month"-20"year,$2,$3,$4,$5,$6}
            }' >> $fileName
done