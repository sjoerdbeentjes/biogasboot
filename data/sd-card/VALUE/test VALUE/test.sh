header="Date,Time,Temp_PT100_1,Temp_PT100_2,pH_Value,Bag_Height"

for i in {1..30}
do
    fileName=$(printf "1703%02d.csv\n" $i)
    touch $fileName
    echo $header > $fileName
    for dataPoint in {0..59}
    do
        printf "%02d-03-2017,15:%02d:40,0,0,0,318.049\n" "$i" "$dataPoint" >> $fileName
    done
done
