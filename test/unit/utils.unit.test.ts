import {
  validatelabelPatternRequirement,
} from '../../src/utils'

import {Inputs} from '../../src/github-helper'


describe('validatelabelPatternRequirement', () => {
  it('should validate against pattern', () => {
    const requirement = 'release'
    const testLabel = 'release'
    expect(validatelabelPatternRequirement(requirement, testLabel)).toBe(
      testLabel
    )
  })
  it('should return undefined', () => {
    const requirement = 'release'
    const testLabel = 'other random label'
    expect(validatelabelPatternRequirement(requirement, testLabel)).toBe(
      undefined
    )
  })
})
