'use client'
import { useState, useEffect } from 'react'

type PartInfo = {
  부품번호: string
  품목명: string
  규격명: string
}

export default function Home() {
  const [rows, setRows] = useState(Array(5).fill({ partNo: '', 품목명: '', 규격명: '' }))
  const [allParts, setAllParts] = useState<PartInfo[]>([])
  const [suggestions, setSuggestions] = useState<PartInfo[]>([])
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  // 🔄 부품 데이터 불러오기
  useEffect(() => {
    fetch('/data/parts_autocomplete.json')
      .then(res => res.json())
      .then(data => setAllParts(data))
  }, [])

  const handleChange = (index: number, value: string) => {
    const trimmed = value.trim()
    const matches = allParts.filter(item =>
      item.부품번호.toLowerCase().includes(trimmed.toLowerCase())
    )

    const updated = [...rows]
    updated[index].partNo = value
    setRows(updated)
    setSuggestions(matches.slice(0, 5))
    setFocusedIndex(index)
  }

  const handleSelect = (item: PartInfo) => {
    if (focusedIndex === null) return
    const updated = [...rows]
    updated[focusedIndex] = {
      partNo: item.부품번호,
      품목명: item.품목명,
      규격명: item.규격명,
    }
    setRows(updated)
    setSuggestions([])
    setFocusedIndex(null)
  }

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>🧾 부품 견적서 자동입력</h1>
      <table style={{ width: '100%', marginTop: 20, borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>부품번호</th>
            <th>품목명</th>
            <th>규격명</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td style={{ position: 'relative' }}>
                <input
                  style={{ width: '100%' }}
                  value={row.partNo}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onFocus={() => setFocusedIndex(index)}
                />
                {focusedIndex === index && suggestions.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    background: 'white',
                    border: '1px solid #ccc',
                    zIndex: 100,
                    width: '100%'
                  }}>
                    {suggestions.map((item, i) => (
                      <div key={i}
                        style={{ padding: 4, cursor: 'pointer' }}
                        onMouseDown={() => handleSelect(item)}
                      >
                        {item.부품번호} - {item.품목명} / {item.규격명}
                      </div>
                    ))}
                  </div>
                )}
              </td>
              <td>{row.품목명}</td>
              <td>{row.규격명}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
