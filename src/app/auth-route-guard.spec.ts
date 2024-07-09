import { TestBed } from '@angular/core/testing';
import { authRouteGuard } from './auth-route-guard';
import { AuthService } from './services/auth.service';
import { Router, UrlTree } from '@angular/router';
import { createSpyFromClass } from 'jest-auto-spies';
import { subscribeSpyTo } from '@hirez_io/observer-spy'

describe('authRouteGuard', () => {
  const setup = (
    path: string = '',
    permissions: string[] = []
  ) => {
    const mockAuthService = createSpyFromClass(AuthService, {
      observablePropsToSpyOn: ['userAuth']
    });
    mockAuthService.userAuth.nextWith(permissions);

    // mock router and spy on parseUrl to return url tree

    const mockRouter = createSpyFromClass(Router, {
      methodsToSpyOn: ['parseUrl']
    });
    const urlTree = new UrlTree();
    mockRouter.parseUrl.mockReturnValue(UrlTree);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService},
        // provide mock router
        { provide: Router, userValue: mockRouter}
      ]
    });

    // instantiate route guard in test bed injection context
    const guard = TestBed.runInInjectionContext(authRouteGuard(path));

    return {
      guard,
      urlTree,
      mockRouter,
    };
  }
  it('returns true when permission exists', () => {
    const path = 'cart';
    const permissions = [path, 'other permission'];

    const { guard } = setup (path, permissions);
    const guardSpy = subscribeSpyTo(guard);

   expect(guardSpy.getLastValue()).toBe(true)
  });

  it('returns UrlTree when permission does not exist', () => {
    const path = 'cart';
    const permissions = ['other permission'];

    const{ guard, urlTree, mockRouter } = setup(path, permissions);
    const guardSpy = subscribeSpyTo(guard);
    expect(guardSpy.getLastValue()).toEqual(urlTree);
    expect(mockRouter.parseUrl).toHaveBeenCalledOnceWith(`/${ROUTER_TOKENS.NOT_AUTH}`);
    // setup

    // subscribe to guard

    // expect guard to return a url tree
  });
})
