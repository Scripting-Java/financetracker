interface DateRangePickerProps{
    startDate: string,
    endDate: string, 
    onStartDateChange: (date: string) => void,
    onEndDateChange: (date: string) => void
}

export default function DateRangePicker(
{startDate, endDate, onStartDateChange, onEndDateChange,}:DateRangePickerProps){
    const isInvalidDate = startDate>endDate
    
    return(
        <section>
            <h3>Select Date Range</h3>
            {
                isInvalidDate &&(<p role="alert">
                Your end date must be on or after your start date.
                </p>)
            }
            <label>
                Pick a Start Date:
                <input type="date" name = "StartDate" id="PickStartDate" value={startDate} onChange={(event)=>onStartDateChange(event.target.value)}></input>
            </label>
            <label>
                Pick an End Date:
                <input type="date" name = "EndDate" id="PickEndDate" value={endDate} onChange={(event)=>onEndDateChange(event.target.value)}></input>
            </label>
        </section>
    )
}