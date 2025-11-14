'use client';

export default function Calendar() {
  const today = new Date();
  const currentDate = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="glass rounded-3xl p-8 border border-primary/20 opacity-100 relative z-10" style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <p className="text-sm text-foreground/60">
          Today: {monthNames[currentMonth]} {currentDate}, {currentYear}
        </p>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-bold text-foreground/70 py-3 uppercase tracking-wide">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const isCurrentDate = day === currentDate && 
                                 currentMonth === today.getMonth() && 
                                 currentYear === today.getFullYear();
          
          return (
            <div key={index} className="aspect-square">
              {day === null ? (
                <div></div>
              ) : (
                <div
                  className={`relative flex items-center justify-center aspect-square rounded-lg font-semibold text-sm transition-all duration-300 ${
                    isCurrentDate
                      ? 'bg-[linear-gradient(to_bottom_right,var(--color-primary),var(--color-primary)/0.8)] text-primary shadow-lg ring-2 ring-primary/50 scale-105'
                      : 'bg-card/50 text-foreground hover:bg-card hover:ring-2 hover:ring-primary/30 cursor-pointer'
                  }`}
                >
                  {day}
                  {isCurrentDate && (
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-primary rounded-full shadow-md ring-2 ring-primary-foreground animate-pulse"></div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-foreground/60">
          Today: {monthNames[currentMonth]} {currentDate}, {currentYear}
        </p>
      </div>
    </div>
  );
}
