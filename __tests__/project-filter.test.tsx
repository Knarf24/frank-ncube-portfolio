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

  it('renders all four projects by default', () => {
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
    expect(
      screen.getByRole('heading', { name: 'Horizon Desk' }),
    ).toBeInTheDocument()
  })

  it('shows Horizon Desk with Devpost and live demo links', () => {
    render(<ProjectFilter projects={projects} />)

    expect(
      screen.getByRole('link', { name: /View Horizon Desk on Devpost/i }),
    ).toHaveAttribute('href', 'https://devpost.com/software/nexa-j9g8ys')
    expect(
      screen.getByRole('link', { name: /View the live Horizon Desk demo/i }),
    ).toHaveAttribute('href', 'https://horizon-desk.netlify.app/?view=data')
    expect(
      screen.queryByRole('link', { name: /View Horizon Desk on GitHub/i }),
    ).not.toBeInTheDocument()
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
