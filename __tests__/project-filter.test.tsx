import userEvent from '@testing-library/user-event'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { projects } from '@/data/projects'
import { ProjectFilter } from '@/components/projects/project-filter'

afterEach(() => {
  cleanup()
})

describe('ProjectFilter', () => {
  it('shows AI projects when AI / ML is selected', async () => {
    const user = userEvent.setup()

    render(<ProjectFilter projects={projects} />)

    await user.click(
      screen.getByRole('button', { name: 'AI / ML' }),
    )

    expect(
      screen.getByRole('heading', { name: 'Triage360' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Streetwise' }),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('heading', {
        name: 'Commerce platform',
      }),
    ).not.toBeInTheDocument()
  })

  it('renders all three projects by default', () => {
    render(<ProjectFilter projects={projects} />)

    expect(
      screen.getByRole('heading', { name: 'Triage360' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Commerce platform' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Streetwise' }),
    ).toBeInTheDocument()
  })

  it('marks the active category with aria-pressed', async () => {
    const user = userEvent.setup()

    render(<ProjectFilter projects={projects} />)

    const aiButton = screen.getByRole('button', { name: 'AI / ML' })
    expect(aiButton).toHaveAttribute('aria-pressed', 'false')

    await user.click(aiButton)

    expect(aiButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('restores all projects when All is selected again', async () => {
    const user = userEvent.setup()

    render(<ProjectFilter projects={projects} />)

    await user.click(screen.getByRole('button', { name: 'AI / ML' }))
    expect(
      screen.queryByRole('heading', { name: 'Commerce platform' }),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'All' }))

    expect(
      screen.getByRole('heading', { name: 'Triage360' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Commerce platform' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Streetwise' }),
    ).toBeInTheDocument()
  })

  it('shows a quiet empty state for Entrepreneurship without inventing a project', async () => {
    const user = userEvent.setup()

    render(<ProjectFilter projects={projects} />)

    await user.click(screen.getByRole('button', { name: 'Entrepreneurship' }))

    expect(screen.queryAllByRole('heading')).toHaveLength(0)
    expect(
      screen.getByText('No projects in this category yet.'),
    ).toBeInTheDocument()
  })
})
