import { useState } from 'react'
import { usePlannerState, usePlannerDispatch } from '../state/store.jsx'
import { weddingView } from '../state/selectors.js'

export default function WeddingScreen() {
  const state = usePlannerState()
  const dispatch = usePlannerDispatch()
  const wedding = weddingView(state)
  const [newItem, setNewItem] = useState('')
  const [addingBudget, setAddingBudget] = useState(false)
  const [budgetLabel, setBudgetLabel] = useState('')
  const [budgetAmount, setBudgetAmount] = useState('')

  const addChecklistItem = () => {
    if (!newItem.trim()) return
    dispatch({ type: 'ADD_TASK', title: newItem.trim(), status: 'wedding' })
    setNewItem('')
  }

  const addBudgetItem = () => {
    const amount = Number(budgetAmount)
    if (!budgetLabel.trim() || !amount) return
    dispatch({ type: 'WEDDING_ADD_BUDGET_ITEM', label: budgetLabel.trim(), amount, status: 'committed' })
    setBudgetLabel('')
    setBudgetAmount('')
    setAddingBudget(false)
  }

  return (
    <div
      style={{
        minHeight: '100%',
        boxSizing: 'border-box',
        background: 'var(--paper)',
        padding: '60px 22px 22px',
        color: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span className="eyebrow">{wedding.dateLabel}</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {wedding.daysOut}
          </span>
          <span style={{ fontSize: 17, fontWeight: 500, color: 'var(--text-muted-2)' }}>days out</span>
        </div>
      </div>

      {wedding.urgent ? (
        <div style={{ background: 'var(--ink)', color: 'var(--paper)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-dark-muted-2)' }}>
            THE ONLY ONE THAT'S URGENT
          </span>
          <span style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.25 }}>{wedding.urgent.title}</span>
          <button
            onClick={() => dispatch({ type: 'COMPLETE_TASK', id: wedding.urgent.id })}
            style={{ alignSelf: 'flex-start', fontSize: 13, fontWeight: 700, color: 'var(--accent-light-text)' }}
          >
            Mark done →
          </button>
        </div>
      ) : (
        <div className="card" style={{ borderRadius: 12, padding: 16 }}>
          <span style={{ fontSize: 15, color: 'var(--text-muted)' }}>Nothing on the wedding list yet. Add the first thing below.</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="eyebrow">NEXT UP</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{wedding.totalCount} total</span>
        </div>
        {wedding.nextUp.map((item, i) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              padding: '13px 0',
              borderBottom: i < wedding.nextUp.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <button
              onClick={() => dispatch({ type: 'COMPLETE_TASK', id: item.id })}
              style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, textAlign: 'left' }}
            >
              <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--border-dashed)', flex: 'none', display: 'block' }} />
              <span style={{ fontSize: 15, fontWeight: 500 }}>{item.title}</span>
            </button>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted-2)', whiteSpace: 'nowrap' }}>
              {item.dueLabel || 'no date'}
            </span>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
            placeholder="Add to the wedding list"
            style={{ flex: 1, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px', fontSize: 14, color: 'var(--ink)' }}
          />
          <button onClick={addChecklistItem} className="link-cta">
            Add
          </button>
        </div>
      </div>

      <div style={{ marginTop: 'auto' }} className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span className="eyebrow">BUDGET</span>
            <span style={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              ${wedding.budget.spent.toLocaleString()}{' '}
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>of ${wedding.budget.total.toLocaleString()}</span>
            </span>
          </div>
          <div style={{ height: 12, borderRadius: 7, background: 'var(--border)', overflow: 'hidden', display: 'flex' }}>
            <span style={{ width: `${wedding.budget.spentPct}%`, background: 'var(--ink)', display: 'block' }} />
            <span style={{ width: `${wedding.budget.committedPct}%`, background: 'var(--accent)', display: 'block' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
            <span>spent</span>
            <span>committed, not paid · ${wedding.budget.committed.toLocaleString()}</span>
          </div>

          {addingBudget ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={budgetLabel}
                onChange={(e) => setBudgetLabel(e.target.value)}
                placeholder="Item"
                style={{ flex: 1, background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: 13 }}
              />
              <input
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                placeholder="$"
                inputMode="numeric"
                style={{ width: 70, background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', fontSize: 13 }}
              />
              <button onClick={addBudgetItem} className="link-cta">
                Add
              </button>
            </div>
          ) : (
            <button onClick={() => setAddingBudget(true)} style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-link)', textAlign: 'left' }}>
              + add budget item
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
