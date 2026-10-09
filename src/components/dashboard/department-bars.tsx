const data = [
  { label: "Kinh doanh", value: 42 },
  { label: "Kỹ thuật", value: 35 },
  { label: "Marketing", value: 18 },
  { label: "Nhân sự", value: 11 },
  { label: "Vận hành", value: 9 },
];

export function DepartmentBars() {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-foreground">
        Nhân sự theo phòng ban
      </h3>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Tổng số nhân viên đang hoạt động
      </p>

      <ul className="mt-5 flex flex-col gap-3.5">
        {data.map((d) => (
          <li key={d.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-foreground">{d.label}</span>
              <span className="font-medium text-muted-foreground">
                {d.value}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-linear-to-r from-primary-light to-primary transition-all duration-500"
                style={{ width: `${(d.value / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
