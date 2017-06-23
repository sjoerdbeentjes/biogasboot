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

# for date in 2015-02-{01..28} 2015-{04,06,09,11}-{01..30} 2015-{03,05,07,08,10,12}-{01..31}
# for date in 2017-02-{01..28} 2017-04-{01..30} 2017-{01,03,05}-{01..31}
for date in 2015-01-{02..31}
do
    year=$(printf "%02s" ${date:2:2})
    month=$(printf "%02s" ${date:5:2})
    day=$(printf "%02s" ${date:8:2})
    fileName=$(printf "%02s%02s%02s.csv\n" $year $month $day )
    cat ./150101.csv | awk -v year=$year -v month=$month -v day=$day -F ',' 'BEGIN{
        OFS = ","
        } {
            if (substr($1,1,1) == "D") {print $0}
            else {$1="";print day"-"month"-20"year$0}
            }' >> $fileName
done